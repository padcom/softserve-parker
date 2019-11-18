import {
  Field,
  ID,
  ObjectType,
  registerEnumType
} from 'type-graphql'
import { FieldPacket, RowDataPacket, OkPacket } from 'mysql'
import { isPast } from 'date-fns'
import { db } from '../db'

import { User } from './User'

export enum RequestStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected"
}

registerEnumType(RequestStatus, {
  name: "RequestStatus",
  description: "Request status types",
});

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

  @Field(() => RequestStatus)
  status: RequestStatus

  @Field(() => Number)
  parkingSpotId: number

  @Field(() => User)
  user (): Promise<User> {
    return User.getById(this.userId)
  }

  static async fetchByUserId(userId: number, from: Date): Promise<ReservationRequest[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      `SELECT * FROM reservationRequest
       WHERE userId = ? AND date >= ?
       ORDER BY date ASC`,
      [userId, from]
    )
    return rows as ReservationRequest[]
  }

  static async create(userId: number, dates: Date[]): Promise<ReservationRequest[]> {
    this.validateDates(dates)
    await this.assertRequestsDoesntExist(userId, dates)
    await db.query(`INSERT INTO reservationRequest (userId, date, status)
          VALUES ?`, [dates.map((date: Date) => [userId, date, RequestStatus.pending])])
    return this.fetchByUserIdAndDates(userId, dates)
  }

  private static validateDates(dates: Date[]): void | Error {
    if (dates.some((date: Date) => isPast(date))) throw new Error(`Provided date is in the past.`)
    const containsDuplicates = dates
      .map((date: Date) => date.getTime())
      .some((value: number, i: number, self: number[]) => self.indexOf(value) !== i)
    if (containsDuplicates) throw new Error('Provided date range contains duplicates.')
  }

  static async assertRequestsDoesntExist(userId: number, dates: Date[]): Promise<void | Error> {
    const records = await this.fetchByUserIdAndDates(userId, dates)
    if (records && records.length) throw new Error('Request already exist')
  }
  
  static async fetchByUserIdAndDates(userId: number, dates: Date[]): Promise<ReservationRequest[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      `SELECT * FROM reservationRequest
        WHERE userId = ? AND date IN(?)
        ORDER BY date ASC`,
      [userId, ...dates]
    )
    return rows as ReservationRequest[]
  }

  static async delete(userId: number, date: Date) {
    const [ result ] = await db.execute(`DELETE from reservationRequest WHERE userId = ? AND date = ?`,
      [userId, date]) as OkPacket[]

      if (result.affectedRows == 0) {
        throw new Error('Requests not found')
      } 

    return result.affectedRows
  }

  static async deleteById(id: number) {
    const [ result ] = await db.execute(`DELETE from reservationRequest WHERE id = ?`,
      [id]) as OkPacket[]

      if (result.affectedRows == 0) {
        throw new Error('Requests not found')
      } 

    return result.affectedRows
  }

  static async getAllByDay(from: Date, to: Date) {
    const [ result ] = await db.execute(`
      SELECT  * FROM parker.reservationRequest
      WHERE date BETWEEN ? AND ?
    `, [from, to])
    
    return result
  }
}
