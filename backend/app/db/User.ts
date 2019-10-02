import { db } from "../db";
import { OkPacket } from "mysql";
import { logger } from "../logger";

export class User {
  async create (email: string, password: string) {
    const [ result ] = await db.execute('INSERT INTO user (email, password) VALUES (?, ?)', [ email, password ]) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new user - reason unknown')
    }

    return result.insertId
  }

  async delete (email: string) {
    const [ result ] = await db.execute('DELETE FROM user WHERE email=?', [ email ]) as OkPacket[]

    if (result.affectedRows == 0) {
      throw new Error('User not found')
    } else if (result.affectedRows > 1) {
      logger.warn('Multiple users deleted')
    }

    return result.affectedRows
  }
}
