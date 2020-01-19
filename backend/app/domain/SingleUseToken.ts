import { v4 as uuid } from 'uuid'
import { db } from '../db'
import { OkPacket, RowDataPacket, FieldPacket } from 'mysql2'

type TokenState = '' | 'invalid'

interface Token {
  id: string
  token: string
  email: string
  state: TokenState
  created: Date
  updated: Date
}

export class SingleUseToken {
  static async generate (email: string) {
    const token = uuid()
    const [ result ] = await db.execute(`
      INSERT INTO sut (token, email) VALUES (?, ?)
    `, [ token, email ]) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new user - reason unknown')
    }

    return token
  }

  static async byToken (token: string): Promise<Token> {
    const [ result ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(`
      SELECT * FROM sut
      WHERE token=? AND state='' AND created > DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 MINUTE)
    `, [ token ])

    if (result.length !== 1) {
      throw new Error('Token not found')
    }

    return result[0] as Token
  }

  static async invalidate (token: string) {
    const { id } = await this.byToken(token)

    const [ result ] = await db.execute(`
      UPDATE sut SET state='invalid', updated=CURRENT_TIMESTAMP WHERE id=?
    `, [ id ]) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to token - reason unknown')
    }

    return id
  }
}
