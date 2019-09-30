import { db } from '../../db'
import { ReservationRequest, RequestStatus } from './typedefs'
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql'

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

  async createReservationRequest(userId: number, dates: Date[]): Promise<[RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]]> {
    return db.execute(
        `INSERT INTO reservationRequest (userId, date, status)
         VALUES ?`,
         [dates.map((date: Date) => [userId, date, RequestStatus.pending])]
        )
  }
}

export const ReservationRequestService = new Service()

