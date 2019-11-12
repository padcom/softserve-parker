import { Field, ID, ObjectType } from 'type-graphql'
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'
import { logger } from '../logger'
import { mailer } from '../mailer'
import env from '../config'

const { EMAIL, CONFIRM_URL_BASE } = env

@ObjectType({
  description: 'Object representing user.',
})
export class User {
  @Field(() => ID)
  id: number

  @Field(() => String)
  email: string

  @Field(() => String)
  firstName: string 

  @Field(() => String)
  lastName: string 

  @Field(() => String)
  plate: string 

  @Field(() => Number)
  phone?: number

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

  static async create (email: string, password: string, firstName: string, lastName: string, plate: string, phone: number) {
    const [ result ] = await db.execute(
      `INSERT INTO user (email, password, firstName, lastName, plate, phone) 
      VALUES (?, ?, ?, ?, ?, ?)`, [ email, password, firstName, lastName, plate, phone ]
    ) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new user - reason unknown')
    }

    return result.insertId
  }
 
  static async validateUserCreation (email: string): Promise<Error | void> {
    const re = /@softserveinc.com\s*$/;
    if (!re.test(email.toLowerCase())) throw new Error('Invalid email address.')
    try {
     const user = await this.getByEmail(email)
     if (user) throw new Error('User with provided email address already exist.')
    } catch (e) {}
  }

  static async sendConfirmationEmail (email: string, userId: number) {
    const transporter = mailer()
    await transporter.sendMail({
          from: EMAIL,
          to: email,
          subject: 'Email Confirmation', 
          html: `<p>Please confirm your email address <a href='${CONFIRM_URL_BASE}/#/confirm-registration/${userId}'>here</a>.<p/>`
      });
  }

  static async setEnabled (id: number, value: Boolean) {
    const [ rows ]: [OkPacket, FieldPacket[]] = await db.execute('UPDATE user SET enabled = ? WHERE id = ?', [Boolean(value), id])

    if (rows.affectedRows == 0) {
      throw new Error('User not found')
    }

    return id
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

  static async getById(id: number): Promise<User> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT * FROM user WHERE id = ?',
      [ id ]
    )
    this.assertFound(rows[0])

    return rows[0] as User
  }

  private static assertFound(user: RowDataPacket) {
    if (!user) throw new Error(`User doesn't exist.`)
  }
}
