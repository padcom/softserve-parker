import { Response, Request } from 'express';
import { FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'
import { logger } from '../logger'

export class Authenticator {
    authenticate = async (req: Request, res: Response) => {
        try {
            const password = await this.getPassword(req.body.username)
            this.assertPasswordsMatching(req.body.password, password)
            res.send();
        } catch (e) {
            logger.error(e)
            res.status(e.status || 500).send()
        }
    }

    private async getPassword(username: string) {
        const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
          `
          SELECT password
          FROM user
          WHERE email = ?
          `,
          [username]
        )
        this.assertUserIsFound(rows[0])
        return rows[0].password
    }

    private assertUserIsFound(user) {
        if (!user) throw new UnauthenticatedError(`User doesn't exist.`)
    }

    private assertPasswordsMatching(password1, password2) {
        if (password1 !== password2) throw new UnauthenticatedError('Incorrect password.')
    }
}

class UnauthenticatedError extends Error {
    status: number
    constructor(txt?: string) {
        super(txt)
        this.name = 'UnauthenticatedError';
        this.status = 403
    }
}
