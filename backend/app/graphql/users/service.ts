import { db } from '../../db'
import { User } from './typedefs'
import { FieldPacket, RowDataPacket } from 'mysql'

class Service {
  async getUseByUsername(username: string): Promise<User> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      `
      SELECT *
      FROM user
      WHERE email = ?
      `,
      [username]
    )
    this.assertUserIsFound(rows[0])
    return rows[0] as User
  }


  private assertUserIsFound(user: RowDataPacket): void | Error {
    if (!user) throw new Error(`User doesn't exist.`)
  }

}

export const UserService = new Service()
