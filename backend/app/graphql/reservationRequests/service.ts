import { db } from '../../db'
import { ReservationRequest, RequestStatus } from './typedefs'
import { FieldPacket, RowDataPacket } from 'mysql'

class Service {
  async fetchByUserId(userId: number, from: Date): Promise<ReservationRequest[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      `SELECT * FROM reservationRequest
       WHERE userId = ? AND date >= ?
       ORDER BY date ASC`,
      [userId, from]
    )
    return rows as ReservationRequest[]
  }

  async createReservationRequest(userId: number, dates: Date[]): Promise<ReservationRequest[]> {
    await this.assertRequestsDoesntExist(userId, dates)
    await db.query(`INSERT INTO reservationRequest (userId, date, status)
          VALUES ?`, [dates.map((date: Date) => [userId, date, RequestStatus.pending])])
    return this.fetchByUserIdAndDates(userId, dates)
  }

  async assertRequestsDoesntExist(userId: number, dates: Date[]): Promise<void | Error> {
    const records = await this.fetchByUserIdAndDates(userId, dates)
    if (records && records.length) throw new Error('Request already exist')
  }
  
  async fetchByUserIdAndDates(userId: number, dates: Date[]): Promise<ReservationRequest[]> {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      `SELECT * FROM reservationRequest
        WHERE userId = ? AND date IN(?)
        ORDER BY date ASC`,
      [userId, ...dates]
    )
    return rows as ReservationRequest[]
  }
}

export const ReservationRequestService = new Service()

