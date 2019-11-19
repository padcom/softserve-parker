import { query } from '@/graphql'

export class Requests {
  static async getAllInDay (from: Date, to: Date) {
    const { reservationRequestsInDay } = await query(`query
      reservationRequestsInDay($from: DateTime!, $to: DateTime!) {
        reservationRequestsInDay(from: $from, to: $to) {
          id
          date
          status
          user {
            firstName
            lastName
            email
            phone
            plate
          }
        }
      }`, { from, to })

    return reservationRequestsInDay
  }
}
