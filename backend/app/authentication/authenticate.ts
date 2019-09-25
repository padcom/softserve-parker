import { Response, Request } from 'express';
import * as fs from 'fs';
import * as path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { db } from '../db'
import { logger } from '../logger'
import { UnauthenticatedError } from '../customErrors'
import { User } from '../graphql/users/typedefs'
import { UserService } from '../graphql/users/service'

export class Authenticator {
  authenticate = async (req: Request, res: Response) => {
    try {
      this.validateParams(req, res);
      const user: User = await UserService.getUseByUsername(req.body.username)
      await this.assertPasswordsMatching(req.body.password, user.password)
      const token: string = await this.getJSONToken(user.id, user.email);
      await this.saveSession(token);
      res.send(token);
    } catch (e) {
      logger.error(e)
      const status = this.getErrorStatus(e)
      res.status(status).send()
    }
  }

  private validateParams(req: Request, res: Response): void | UnauthenticatedError {
    if (!req.body.username || !req.body.password) throw new UnauthenticatedError('Credentials not provided.')
  }

  private async assertPasswordsMatching(password: string, hash: string): Promise<void | UnauthenticatedError>  {
    const match: boolean = await bcrypt.compare(password, hash)
    if (!match) throw new UnauthenticatedError('Incorrect password.')
  }

  private async getJSONToken(userID: number, email: string): Promise<string> {
    var cert: string  = fs.readFileSync(path.resolve(__dirname, '../../private.key'), 'utf8');
    return jwt.sign({userID, email}, cert, {algorithm: 'RS256'});
  }

  private async saveSession(token: string): Promise<void> {
    db.execute(`INSERT INTO sessions (token) VALUES (?)`, [token])
  }

  private getErrorStatus(e: Error): number {
    if (e instanceof UnauthenticatedError || e.message === `User doesn't exist.`) {
      return 403
    } else {
      return 500
    }
  }
}
