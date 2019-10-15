import { query } from '@/graphql'

export class ReservationRequest {
  static async fetchByUserId(
    userId: number,
    from: Date = new Date(),
    fields: string[] = ['id', 'date', 'status']
  ) {
    const { reservationRequests } = await query(
      `query
      ReservationRequests($from: DateTime!, $userId: Int!) {
        reservationRequests(from: $from, userId: $userId) {
          ${fields.join('\n')}
        }
      }`,
      {
        from,
        userId
      }
    )

    return reservationRequests
  }

  static async cancel(requestId: number): Promise<number | Error> {
    return query(
      `mutation
      cancelReservationRequest($id: Int!) {
        cancelReservationRequest(id: $id)
      }`,
      {
        id: requestId
      }
    )
  }

  static async createRequest(
    userId: number,
    dates: Date[],
    fields: string[] = ['id', 'date', 'status']
  ) {
    const { reservationRequests } = await query(
      `mutation
      CreateReservationRequest($dates: [DateTime!]!, $userId: Int!) {
        createReservationRequest(dates: $dates, userId: $userId) {
          ${fields.join('\n')}
        }
      }`,
      {
        dates,
        userId
      }
    )

    return reservationRequests
  }
}
