import { query } from '@/graphql'

export interface Request {
  id: number
  date: Date
  email: string
  status: string
  user: {
    firstName: string
    lastName: string
    email: string
    phone: string
    plate: string
    roles: string
  }
}

export class RequestAPI {
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
            roles
          }
        }
      }`, { from, to })

    return reservationRequestsInDay
  }

  static async upcoming () {
    const { upcomingReservations }: { upcomingReservations: Request[] } = await query(`query {
      upcomingReservations {
        id
        date
        status
        user {
          firstName
          lastName
          email
          phone
          plate
          roles
        }
      }
    }
    `)

    return upcomingReservations
  }
}
