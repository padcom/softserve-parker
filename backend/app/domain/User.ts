import { Field, ID, ObjectType } from 'type-graphql'
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'
import { logger } from '../logger'

@ObjectType({
  description: 'Object representing user.',
})
export class User {
  @Field(() => ID)
  id: number

  @Field(() => String)
  email: string

  @Field(() => Boolean)
  reserved: boolean

  @Field(() => Date)
  created: Date

  @Field(() => String)
  password: string

  @Field(() => Number)
  rank (): number {
    return Math.round(Math.random() * 200)
  }

  @Field(() => Boolean)
  enabled: boolean

  roles: string

  static async create (email: string, password: string) {
    const [ result ] = await db.execute('INSERT INTO user (email, password) VALUES (?, ?)', [ email, password ]) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new user - reason unknown')
    }

    return result.insertId
  }

  static async delete (email: string) {
    const [ result ] = await db.execute('DELETE FROM user WHERE email=?', [ email ]) as OkPacket[]

    if (result.affectedRows == 0) {
      throw new Error('User not found')
    } else if (result.affectedRows > 1) {
      logger.warn('Multiple users deleted')
    }

    return result.affectedRows
  }

  static async getByEmail(email: string): Promise<User> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT * FROM user WHERE email = ?',
      [ email ]
    )
    this.assertFound(rows[0])

    return rows[0] as User
  }

  private static assertFound(user: RowDataPacket) {
    if (!user) throw new Error(`User doesn't exist.`)
  }
}
