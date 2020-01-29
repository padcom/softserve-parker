import { query } from '@/graphql'
import logger from '@/logger'

export interface ReservationRequest {
  id: number
  date: string
  status: string
}

export class ReservationRequestAPI {
  static async fetchByUserId (
    userId: number,
    from: string,
    fields: string[] = [ 'id', 'date', 'status' ]
  ) {
    const { reservationRequests } = await query(
      `query
      ReservationRequests($from: String!, $userId: Int!) {
        reservationRequests(from: $from, userId: $userId) {
          ${fields.join(',')}
        }
      }`,
      { from, userId }
    )

    return reservationRequests
  }

  static async setRequestStatus (id: number, status: string): Promise<number | Error> {
    logger.debug('ReservationRequestAPI.setRequestStatus(', id, ',', status, ')')

    return query(
      `mutation
      setReservationRequestStatus($id: Int!, $status: String!) {
        setReservationRequestStatus(id: $id, status: $status)
      }`,
      { id: Number(id), status }
    )
  }

  static async cancel (requestId: number): Promise<number | Error> {
    return this.setRequestStatus(requestId, 'cancelled')
  }

  static async createRequest (
    userId: number,
    dates: string[],
    fields: string[] = [ 'id', 'date', 'status' ]
  ) {
    const { reservationRequests } = await query(
      `mutation
      CreateReservationRequest($dates: [String!]!, $userId: Int!) {
        createReservationRequest(dates: $dates, userId: $userId) {
          ${fields.join(',')}
        }
      }`,
      { dates, userId }
    )

    return reservationRequests
  }
}
