import { Response, Request } from 'express';
import * as fs from 'fs';
import * as path from 'path'
import { FieldPacket, RowDataPacket } from 'mysql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { db } from '../db'
import { logger } from '../logger'
import { UnauthenticatedError } from '../customErrors'

export class Authenticator {
    authenticate = async (req: Request, res: Response) => {
        try {
            const user = await this.getUser(req.body.username)
            await this.assertPasswordsMatching(req.body.password, user.password)
            const token = await this.getJSONToken(user.id, user.email);
            await this.saveSession(token);
            res.send(token);
        } catch (e) {
            logger.error(e)
            res.status(e.status || 500).send()
        }
    }

    private async getUser(username: string) {
        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
          `
          SELECT *
          FROM user
          WHERE email = ?
          `,
          [username]
        )
        this.assertUserIsFound(rows[0])
        return rows[0]
    }

    private assertUserIsFound(user): void | UnauthenticatedError {
        if (!user) throw new UnauthenticatedError(`User doesn't exist.`)
    }

    private async assertPasswordsMatching(password, hash): Promise<void | UnauthenticatedError>  {
        const match = await bcrypt.compare(password, hash)
        if (!match) throw new UnauthenticatedError('Incorrect password.')
    }

    private async getJSONToken(userID, email): Promise<string> {
        var cert  = fs.readFileSync(path.resolve(__dirname, '../../private.key'), 'utf8');
        return jwt.sign({userID, email}, cert, {algorithm: 'RS256'});
    }

    private async saveSession(token) {
        db.execute(`INSERT INTO sessions (token) VALUES (?)`,[token])
    }
}
