import { db } from '../db'
import { RowDataPacket, FieldPacket } from 'mysql'

export class Session {
  async create (token: string) {
    await db.execute(`INSERT INTO sessions (token) VALUES (?)`, [ token ])
  }

  async delete (token: string) {
    await db.execute(`DELETE FROM sessions WHERE token=?`, [ token ])
  }

  async fetch (token: string) {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT * FROM sessions WHERE token=?',
      [ token ]
    )
    return rows.length ? rows[0] : null
  }

  async fetchToken (token: string): Promise<string> {
    const session = await this.fetch(token)
    return session ? session.token : null
  }
}
