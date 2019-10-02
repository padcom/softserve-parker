import { RowDataPacket, FieldPacket, OkPacket } from 'mysql'
import { db } from '../db'
import { logger } from '../logger'

export class Session {
  token: string

  static async create (token: string) {
    const [ result ] = await db.execute(`INSERT INTO sessions (token) VALUES (?)`, [ token ]) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new user - reason unknown')
    }

    return result.insertId
  }

  static async delete (token: string) {
    const [ result ] = await db.execute(`DELETE FROM sessions WHERE token=?`, [ token ]) as OkPacket[]

    if (result.affectedRows == 0) {
      throw new Error('User not found')
    } else if (result.affectedRows > 1) {
      logger.warn('Multiple users deleted')
    }

    return result.affectedRows
  }

  static async fetch (token: string) {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT * FROM sessions WHERE token=?',
      [ token ]
    )

    return rows.length >= 0 ? rows[0] as Session : null
  }

  static async fetchToken (token: string) {
    const session = await this.fetch(token)
    return session ? session.token : null
  }
}
