import { Field, ID, ObjectType } from 'type-graphql'
import { FieldPacket, RowDataPacket, OkPacket } from 'mysql'
import { isPast } from 'date-fns'
import { db } from '../db'

import { User } from './User'

@ObjectType({
  description: 'Object representing reservation request.',
})
export class ReservationRequest {
  @Field(() => ID)
  id: number

  @Field(() => Number)
  userId: number

  @Field(() => Date)
  date: Date

  @Field(() => Number, { nullable: true })
  parkingSpotId: number

  @Field(() => String)
  status: string

  @Field(() => Number, { nullable: true })
  rank?: number

  @Field(() => User)
  user (): Promise<User> {
    return User.byId(this.userId)
  }

  static async byUserId (userId: number, from: Date): Promise<ReservationRequest[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      `SELECT * FROM reservationRequest
       WHERE userId = ? AND date >= ?
       ORDER BY date ASC`,
      [userId, from]
    )
    return rows as ReservationRequest[]
  }

  static async create (userId: number, dates: Date[], validate = true): Promise<ReservationRequest[]> {
    if (validate) this.validateDates(dates)
    await this.assertRequestsDoesntExist(userId, dates)

    await db.query(
      `INSERT INTO reservationRequest (userId, date, status) VALUES ?`,
      [ dates.map(date => [ userId, date, '' ]) ],
    )

    return this.byUserIdAndDates(userId, dates)
  }

  private static validateDates (dates: Date[]): void | Error {
    if (dates.some((date: Date) => isPast(date))) throw new Error(`Provided date is in the past.`)
    const containsDuplicates = dates
      .map((date: Date) => date.getTime())
      .some((value: number, i: number, self: number[]) => self.indexOf(value) !== i)
    if (containsDuplicates) throw new Error('Provided date range contains duplicates.')
  }

  static async assertRequestsDoesntExist (userId: number, dates: Date[]): Promise<void | Error> {
    const records = await this.byUserIdAndDates(userId, dates)
    if (records && records.length) throw new Error('Request already exist')
  }

  static async byUserIdAndDates (userId: number, dates: Date[]): Promise<ReservationRequest[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      `SELECT * FROM reservationRequest
        WHERE userId = ? AND date IN(?)
        ORDER BY date ASC`,
      [userId, ...dates]
    )

    return rows as ReservationRequest[]
  }

  static async delete (userId: number, date: Date) {
    const [ result ] = await db.execute(`DELETE from reservationRequest WHERE userId = ? AND date = ?`,
      [userId, date]) as OkPacket[]

      if (result.affectedRows == 0) {
        throw new Error('Requests not found')
      }

    return result.affectedRows
  }

  static async updateStatus (id: number, status: string) {
    const [ result ] = await db.execute(
      `UPDATE reservationRequest SET status=? WHERE id = ?`,
      [ status, id ]
    ) as OkPacket[]

    if (result.affectedRows == 0) {
      throw new Error('Requests not found')
    } 

    return result.affectedRows
  }

  static async updateRank (id: number, rank: number) {
    const [ result ] = await db.execute(
      'UPDATE reservationRequest SET `rank`=? WHERE id = ?',
      [ rank, id ]
    ) as OkPacket[]

    if (result.affectedRows == 0) {
      throw new Error('Requests not found')
    } 

    return result.affectedRows
  }

  static async cancelById (id: number) {
    return ReservationRequest.updateStatus(id, 'cancelled')
  }

  static async between (from: Date, to: Date): Promise<ReservationRequest[]> {
    const [ result ] = await db.execute(`
      SELECT  * FROM parker.reservationRequest
      WHERE date BETWEEN ? AND ?
    `, [from, to])

    return result as ReservationRequest[]
  }
}
