import {
  Field,
  ID,
  ObjectType,
  registerEnumType
} from 'type-graphql'
import { FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'
import { DateValidator } from '../utilities'

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

  static async fetchByUserId(userId: number, from: Date): Promise<ReservationRequest[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      `SELECT * FROM reservationRequest
       WHERE userId = ? AND date >= ?
       ORDER BY date ASC`,
      [userId, from]
    )
    return rows as ReservationRequest[]
  }

  static async createReservationRequest(userId: number, dates: Date[]): Promise<ReservationRequest[]> {
    this.validateDates(dates)
    await this.assertRequestsDoesntExist(userId, dates)
    await db.query(`INSERT INTO reservationRequest (userId, date, status)
          VALUES ?`, [dates.map((date: Date) => [userId, date, RequestStatus.pending])])
    return this.fetchByUserIdAndDates(userId, dates)
  }

  static validateDates(dates: Date[]): void | Error {
    DateValidator.assertDatesIsntInThePast(dates)
    DateValidator.assertDoesntContainsDuplicates(dates)
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
}