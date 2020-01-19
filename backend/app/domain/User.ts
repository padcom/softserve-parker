import { Field, ID, ObjectType } from 'type-graphql'
import { OkPacket, RowDataPacket } from 'mysql'
import bcrypt from 'bcrypt'
import { db } from '../db'
import { logger } from '../logger'
import { mailer } from '../mailer'
import env from '../config'
import { calculateCurrentRanking } from '../engine'

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

  @Field(() => String, { nullable: true })
  phone?: string

  @Field(() => Date)
  created: Date

  @Field(() => String)
  password: string

  @Field(() => String)
  state: string

  @Field(() => Number)
  async rank (): Promise<number> {
    const ranking = await calculateCurrentRanking()
    const user = ranking.users.find(user => user.id === this.id)

    if (!user) {
      return -1;
    }

    return user.rank
  }

  @Field(() => String, { nullable: true })
  roles?: string

  @Field(() => String, { nullable: true })
  description?: string

  static async create (email: string, password: string, firstName: string, lastName: string, plate: string, phone: string, roles: string, state: string, description: string = null) {
    const hashedPassword = await bcrypt.hash(password, 10)

    const [ result ] = await db.execute(
      `INSERT INTO user (email, password, firstName, lastName, plate, phone, roles, state) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [ email, hashedPassword, firstName, lastName, plate, phone, roles, state ]
    ) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new user - reason unknown')
    }

    if (description) {
      User.updateDescription(result.insertId, description)
    }

    if (state === 'inactive') {
      await User.sendConfirmationEmail(email, result.insertId)
    }

    return result.insertId
  }

  static async update (id: number, state: string, firstName: string, lastName: string, plate: string, phone: string, roles: string, description: string) {
    const [ result ] = await db.execute(
      `UPDATE user
      SET state=?, firstName=?, lastName=?, plate=?, phone=?, roles=?
      WHERE id=?`, [ state, firstName, lastName, plate, phone, roles, id ]
    ) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to update user - reason unknown')
    }

    if (description !== null && description !== undefined) {
      this.updateDescription(id, description)
    }

    return id
  }

  static async updateDescription (id: number, description: string) {
    const [ result ] = await db.execute(
      `UPDATE user
      SET description=?
      WHERE id=?`, [ description, id ]
    ) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to update user description - reason unknown')
    }

    return id
  }

  static async validateUserCreation (email: string): Promise<Error | void> {
    const re = /@softserveinc.com\s*$/;
    if (!re.test(email.toLowerCase())) throw new Error('Invalid email address.')
    try {
     const user = await this.byEmail(email)
     if (user) throw new Error('User with provided email address already exist.')
    } catch (e) {}
  }

  static async sendConfirmationEmail (email: string, userId: number) {
    const response = await mailer().sendMail({
          from: EMAIL,
          to: email,
          subject: 'Email Confirmation', 
          html: `<p>Please confirm your email address <a href='${CONFIRM_URL_BASE}/#/confirm-registration/${userId}'>here</a>.<p/>`,
      });

    logger.info(`EMAIL: ${JSON.stringify(response)}`)
  }

  static async setEnabled (id: number, value: boolean) {
    const [ rows ] = await db.execute(
      'UPDATE user SET state = ? WHERE id = ?',
      [ Boolean(value) ? 'active' : 'inactive', id ]
    ) as OkPacket[]

    if (rows.affectedRows == 0) {
      throw new Error('User not found')
    }

    return id
  }

  static async deleteByEmail (email: string) {
    const [ result ] = await db.execute(
      'DELETE FROM user WHERE email=?',
      [ email ]
    ) as OkPacket[]

    if (result.affectedRows == 0) {
      throw new Error('User not found')
    } else if (result.affectedRows > 1) {
      logger.warn('Multiple users deleted')
    }

    return result.affectedRows
  }

  static async delete (id: number) {
    const [ result ] = await db.execute(
      `UPDATE user SET firstName='', lastName='', plate='', phone='', state='deleted' WHERE id=?`,
      [ id ]
    ) as OkPacket[]

    if (result.affectedRows == 0) {
      throw new Error('User not found')
    } else if (result.affectedRows > 1) {
      logger.warn('Multiple users anonymized!')
    }

    return result.affectedRows
  }

  static async byEmail (email: string): Promise<User> {
    const [ rows ] = await db.execute(
      'SELECT * FROM user WHERE email = ?',
      [ email ]
    )
    this.assertFound(rows[0])

    return rows[0] as User
  }

  static async byId (id: number): Promise<User> {
    const [ rows ] = await db.execute(
      'SELECT * FROM user WHERE id = ?',
      [ id ]
    )
    this.assertFound(rows[0])

    return rows[0] as User
  }

  static async all (): Promise<User[]> {
    const [ rows ] = await db.execute(
      'SELECT * FROM user'
    )
    this.assertFound(rows[0])

    return rows as User[]
  }

  static async active (): Promise<User[]> {
    const [ rows ] = await db.execute(
      `SELECT * FROM user WHERE state='active'`
    )
    this.assertFound(rows[0])

    return rows as User[]
  }

  private static assertFound (user: RowDataPacket) {
    if (!user) throw new Error(`User doesn't exist.`)
  }

  static async setPassword (userId: number, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)

    const [ rows ] = await db.execute(
      'UPDATE user SET password = ? WHERE id = ?',
      [ hashedPassword, userId ]
    ) as OkPacket[]

    if (rows.affectedRows == 0) {
      throw new Error('User not found')
    }

    return userId
  }
}
