import { Field, ID, ObjectType } from 'type-graphql'
import { FieldPacket, RowDataPacket, OkPacket } from 'mysql'
import { isBefore, format } from 'date-fns'
import { db } from '../db'

import { User } from './User'
import { Settings } from './Settings'
import { History } from './History'

@ObjectType({
  description: 'Object representing reservation request.',
})
export class ReservationRequest {
  @Field(() => ID)
  id: number

  @Field(() => Number)
  userId: number

  @Field(() => String)
  date: string

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

  private static mapRowsToReservationRequest (rows) {
    return rows.map(row => ({ ...row, date: format(row.date, 'yyyy-MM-dd') })) as ReservationRequest[]
  }

  static async byUserId (userId: number, from: string): Promise<ReservationRequest[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      `SELECT * FROM reservationRequest
       WHERE userId = ? AND date >= ?
       ORDER BY date`,
      [userId, from]
    )
    return this.mapRowsToReservationRequest(rows)
  }

  static async create (userId: number, dates: string[], validate = true): Promise<ReservationRequest[]> {
    if (validate) this.validateDates(dates)
    await this.assertRequestsDoesntExist(userId, dates)

    await db.query(
      `INSERT INTO reservationRequest (userId, date, status) VALUES ?`,
      [ dates.map(date => [ userId, date, '' ]) ],
    )

    return this.byUserIdAndDates(userId, dates)
  }

  private static async validateDates (dates: string[]): Promise<void | Error> {
    const today = new Date(await Settings.today())
    const timestamps = dates.map(date => new Date(date))
    if (timestamps.some(date => isBefore(date, today))) {
      throw new Error(`Provided date is in the past.`)
    }
    const containsDuplicates = timestamps
      .map(date => date.getTime())
      .some((value, i, self) => self.indexOf(value) !== i)
    if (containsDuplicates) throw new Error('Provided date range contains duplicates.')
  }

  static async assertRequestsDoesntExist (userId: number, dates: string[]): Promise<void | Error> {
    const records = await this.byUserIdAndDates(userId, dates)
    if (records && records.length) throw new Error('Request already exist')
  }

  static async byUserIdAndDates (userId: number, dates: string[]): Promise<ReservationRequest[]> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.query(
      `SELECT * FROM reservationRequest
        WHERE userId = ? AND date IN(?)
        ORDER BY date ASC`,
      [ userId, ...dates ]
    )

    return this.mapRowsToReservationRequest(rows)
  }

  static async delete (userId: number, date: string) {
    const [ result ] = await db.execute(`DELETE from reservationRequest WHERE userId = ? AND date = ?`,
      [userId, date]) as OkPacket[]

    if (result.affectedRows === 0) {
      throw new Error('Requests not found')
    }

    return result.affectedRows
  }

  static async updateStatus (id: number, status: string) {
    console.log('Updating status of request', id, 'to', status)

    const [ result ] = await db.execute(
      `UPDATE reservationRequest SET status=? WHERE id = ?`,
      [ status, id ]
    ) as OkPacket[]

    if (result.affectedRows === 0) {
      throw new Error('Requests not found')
    } 

    if (result.affectedRows !== 1) {
      throw new Error('More than one request has been updated!')
    } 

    return result.affectedRows
  }

  static async updateRank (id: number, rank: number) {
    console.log('Updating rank of request', id, 'to', rank)

    const [ result ] = await db.execute(
      'UPDATE reservationRequest SET `rank`=? WHERE id = ?',
      [ rank, id ]
    ) as OkPacket[]

    if (result.affectedRows === 0) {
      throw new Error('Requests not found')
    } 

    return result.affectedRows
  }

  static async cancelById (id: number) {
    return ReservationRequest.updateStatus(id, 'cancelled')
  }

  static async between (from: string, to: string): Promise<ReservationRequest[]> {
    const [ rows ] = await db.execute(`
      SELECT * FROM parker.reservationRequest
      WHERE date BETWEEN ? AND ?
    `, [ from, to ])

    return this.mapRowsToReservationRequest(rows)
  }

  static async upcoming (): Promise<ReservationRequest[]> {
    const today = await Settings.today()
    const [ rows ] = await db.execute(`
      SELECT * from reservationRequest
      WHERE status = '' AND date > ?
    `, [ today ])

    return this.mapRowsToReservationRequest(rows)
  }

  static async byIdAndStatus (id: number, status: string) {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      `SELECT * from reservationRequest WHERE id=? AND status=?
    `, [ id, status ])
    if (rows.length && rows.length === 0) {
      throw new Error(`Request with id ${id} not found!`)
    }
    return this.mapRowsToReservationRequest(rows)[0]
  }

  static async takeLastMinuteSpot (abandonedId: number, lostId: number) {
    const abandoned = await ReservationRequest.byIdAndStatus(abandonedId, 'abandoned')
    if (!abandoned) return false

    const lost = await ReservationRequest.byIdAndStatus(lostId, 'lost')
    if (!lost) return false

    const history = await History.byDateAndUserId(abandoned.date, abandoned.userId)
    await History.setState(history.id, 'cancelled')

    const user = await lost.user()

    await History.create(
        history.date,
        history.numberOfParkingSpots,
        history.numberOfRequests,
        lost.userId,
        user.plate,
        lost.rank,
        'used'
    )

    await ReservationRequest.updateStatus(abandonedId, 'cancelled')
    await ReservationRequest.updateStatus(lostId, 'won')

    return true
  }

  static async abandonedRequests (date: string, userId: number) {
    const [ rows ] = await db.execute(`
      SELECT * from reservationRequest
      WHERE status = 'abandoned' AND date = ? AND userId <> ?
    `, [ date, userId ])

    return this.mapRowsToReservationRequest(rows)
  }
}
