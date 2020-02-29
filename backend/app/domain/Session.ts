import { Field, ObjectType } from 'type-graphql'
import { RowDataPacket, FieldPacket, OkPacket } from 'mysql'
import jwt from 'jsonwebtoken'
import { db } from '../db'
import { logger } from '../logger'

@ObjectType({
  description: 'Object representing logged in user',
})
export class Session {
  @Field(() => String!)
  id: string

  @Field(() => String!)
  token: string

  @Field(() => String!)
  userId () {
    try {
      // @ts-ignore
      return jwt.decode(this.token).userID
    } catch {
      return ''
    }
  }

  @Field(() => String!)
  email () {
    try {
      // @ts-ignore
      return jwt.decode(this.token).email
    } catch {
      return ''
    }
  }

  static async create (token: string) {
    const [ result ] = await db.execute(`INSERT INTO sessions (token) VALUES (?)`, [ token ]) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new user - reason unknown')
    }

    logger.info(`Session created for token ${token}`)

    return result.insertId
  }

  static async delete (token: string) {
    const [ result ] = await db.execute(`DELETE FROM sessions WHERE token=?`, [ token ]) as OkPacket[]

    if (result.affectedRows == 0) {
      throw new Error('User not found')
    } else if (result.affectedRows > 1) {
      logger.warn('Multiple users deleted')
    }

    logger.info(`Session deleted for token ${token}`)

    return result.affectedRows
  }

  static async forceDelete (token: string) {
    try {
      this.delete(token)
    } catch {
    }
  }

  static async fetch (token: string) {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT * FROM sessions WHERE token=?',
      [ token ]
    )

    return rows.length > 0 ? rows[0] as Session : null
  }

  static async fetchToken (token: string) {
    const session = await this.fetch(token)
    return session ? session.token : null
  }

  static async all () {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT id, token FROM sessions'
    )

    return rows as Session[]
  }
}
