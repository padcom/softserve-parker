import { Field, ID, ObjectType } from 'type-graphql'
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql'
import bcrypt from 'bcrypt'
import { db } from '../db'
import { logger } from '../logger'
import { mailer } from '../mailer'
import env from '../config'

const { EMAIL, CONFIRM_URL_BASE } = env

@ObjectType({
  description: 'Object representing roles.',
})
export class Roles {
  @Field(() => ID)
  id: number

  @Field(() => String)
  name: string

  static async create (name: string) {
    const [ result ] = await db.execute(
      `INSERT INTO roles (name) 
      VALUES (?)`, [ name ]
    ) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new role - reason unknown')
    }

    return result.insertId
  }

  static async update (name: string, id: string) {
    const [ result ] = await db.execute(
      `UPDATE user
      SET name=?
      WHERE id=?`, [ name, id ]
    ) as OkPacket[]

    return id
  }
 
  // static async validateUserCreation (email: string): Promise<Error | void> {
  //   const re = /@softserveinc.com\s*$/;
  //   if (!re.test(email.toLowerCase())) throw new Error('Invalid email address.')
  //   try {
  //    const user = await this.getByEmail(email)
  //    if (user) throw new Error('User with provided email address already exist.')
  //   } catch (e) {}
  // }

  
  // static async setEnabled (id: number, value: Boolean) {
  //   const [ rows ]: [OkPacket, FieldPacket[]] = await db.execute('UPDATE user SET enabled = ? WHERE id = ?', [Boolean(value), id])

  //   if (rows.affectedRows == 0) {
  //     throw new Error('User not found')
  //   }

  //   return id
  // }

  // static async delete (email: string) {
  //   const [ result ] = await db.execute('DELETE FROM user WHERE email=?', [ email ]) as OkPacket[]

  //   if (result.affectedRows == 0) {
  //     throw new Error('User not found')
  //   } else if (result.affectedRows > 1) {
  //     logger.warn('Multiple users deleted')
  //   }

  //   return result.affectedRows
  // }

  // static async deleteByID (id: string) {
  //   const [ result ] = await db.execute('DELETE FROM user WHERE id=?', [ id ]) as OkPacket[]

  //   if (result.affectedRows == 0) {
  //     throw new Error('User not found')
  //   } else if (result.affectedRows > 1) {
  //     logger.warn('Multiple users deleted')
  //   }

  //   return result.affectedRows
  // }

  // static async getByEmail(email: string): Promise<User> {
  //   const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
  //     'SELECT * FROM user WHERE email = ?',
  //     [ email ]
  //   )
  //   this.assertFound(rows[0])

  //   return rows[0] as User
  // }

  // static async getById(id: number): Promise<User> {
  //   const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
  //     'SELECT * FROM user WHERE id = ?',
  //     [ id ]
  //   )
  //   this.assertFound(rows[0])

  //   return rows[0] as User
  // }

  static async getAll(): Promise<Roles[]> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT * FROM roles'
    )
    this.assertFound(rows[0])

    return rows as Roles[]
  }

  private static assertFound(roles: RowDataPacket) {
    if (!roles) throw new Error(`Roles doesn't exist.`)
  }

}
