import { Field, ID, ObjectType } from 'type-graphql'
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'
import { logger } from '../logger'
import { mailer } from '../mailer'

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

  static async create (email: string, password: string, firstName: string, lastName: string, plate: string, phone: number = null) {
    this.validateEmail(email)
    const [ result ] = await db.execute(
      `INSERT INTO user (email, password, firstName, lastName, plate, phone) 
      VALUES (?, ?, ?, ?, ?, ?)`, [ email, password, firstName, lastName, plate, phone ]
    ) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new user - reason unknown')
    }
    await this.sendConfirmationEmail(email)
    return result.insertId
  }
 
  private static validateEmail (email: string): Error | void {
    var re = /@softserveinc.com\s*$/;
    if (!re.test(email.toLowerCase())) throw new Error('Invalid email address.')
  }

  private static async sendConfirmationEmail (email: string) {
    const transporter = mailer()
    let info = await transporter.sendMail({
          from: 'ssparkertesting@gmail.com',
          to: email,
          subject: 'Email Confirmation', 
          html: '<p>please confirm your email<p/>'
      });

      console.log(info)
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
