import { Response, Request } from 'express';
import * as fs from 'fs';
import * as path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { db } from '../db'
import { logger } from '../logger'
import { UnauthenticatedError } from '../customErrors'
import { User } from '../graphql/users'
import { UserService } from '../graphql/users'

export class Authenticator {
  cert: string  = fs.readFileSync(path.resolve(__dirname, '../../private.key'), 'utf8')

  authenticate = async (req: Request, res: Response) => {
    try {
      this.validateParams(req);
      const user: User = await UserService.getUserByEmail(req.body.email)
      await this.assertPasswordsMatching(req.body.password, user.password)
      const token = await this.getJSONToken(user.id, user.email);
      await this.saveSession(token);
      res.end(token);
    } catch (e) {
      logger.error(e)
      const status = this.getErrorStatus(e)
      res.status(status).end(e.message)
    }
  }

  logout = async (req: Request, res: Response) => {
    try {
      await this.deleteSession(this.getTokenFromRequest(req))
      res.status(200).end('User logged out successfuly')
    } catch (e) {
      logger.error(e)
      const status = this.getErrorStatus(e)
      res.status(status).end(e.message)
    }
  }

  private validateParams(req: Request): void | UnauthenticatedError {
    if (!req.body || !req.body.email || !req.body.password) throw new UnauthenticatedError('Credentials not provided.')
  }

  private async assertPasswordsMatching(password: string, hash: string): Promise<void | UnauthenticatedError>  {
    const match: boolean = await bcrypt.compare(password, hash)
    if (!match) throw new UnauthenticatedError('Incorrect password.')
  }

  private async getJSONToken(userID: number, email: string): Promise<string> {
    return jwt.sign({ userID, email }, this.cert, { algorithm: 'RS256' });
  }

  private async saveSession(token: string) {
    await db.execute(`INSERT INTO sessions (token) VALUES (?)`, [ token ])
  }

  private getTokenFromRequest (req: Request): string {
    const header = req.header('Authorization')
    if (!header) throw new UnauthenticatedError('User not logged in')

    return header.split(' ')[1]
  }

  private async deleteSession(token: string) {
    await db.execute(`DELETE FROM sessions WHERE token=?`, [ token ])
  }

  private getErrorStatus(e: Error): number {
    if (e instanceof UnauthenticatedError || e.message === `User doesn't exist.`) {
      return 403
    } else {
      return 500
    }
  }
}
