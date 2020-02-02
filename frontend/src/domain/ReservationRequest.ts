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

  static async abandonedRequests (date: string, userId: number) {
    const { abandonedRequests } = await query(`query
      AbandonedRequests($date: String!, $userId: Int!) {
        abandonedRequests (date: $date, userId: $userId) {
          id, date, status, userId
        }
      }`, { date, userId })

    return abandonedRequests
  }

  static async takeLastMinuteSpot (abandoned: any, lost: any): Promise<number | Error> {
    logger.debug('ReservationRequestAPI.takeLastMinuteSpot(', abandoned, ',', lost, ')')

    const { takeLastMinuteSpot } = await query(
      `mutation
        takeLastMinuteSpot($abandoned: ID!, $lost: ID!) {
          takeLastMinuteSpot(abandoned: $abandoned, lost: $lost)
        }`,
      { abandoned: abandoned.id, lost: lost.id }
    )

    return takeLastMinuteSpot
  }
}
