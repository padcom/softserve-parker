import { Response, Request } from 'express';
import { FieldPacket, RowDataPacket } from 'mysql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { db } from '../db'
import { logger } from '../logger'

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

    private assertUserIsFound(user) {
        if (!user) throw new UnauthenticatedError(`User doesn't exist.`)
    }

    private async assertPasswordsMatching(password, hash) {
        const match = await bcrypt.compare(password, hash)
        if (!match) throw new UnauthenticatedError('Incorrect password.')
    }

    private async getJSONToken(userID, email) {
        return jwt.sign({userID, email}, 'ndlu35nap@nd#!nd1k8cy');
    }

    private async saveSession(token) {
        db.execute(
            `INSERT INTO sessions (token) VALUES (?)`,
            [token]
          )
    }
}

class UnauthenticatedError extends Error {
    status: number
    constructor(txt: string) {
        super(txt)
        this.name = 'UnauthenticatedError';
        this.status = 403
    }
}
