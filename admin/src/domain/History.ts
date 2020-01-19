import { query } from '@/graphql'

export interface History {
  id: number
  date: Date
  state: string
  plate: string
  rank: number
  capacity: number
  requests: number
  user: {
    firstName: string
    lastName: string
    email: string
    phone: string
    plate: string
    roles: string
  }
}

export class HistoryAPI {
  static async getForDates (from: Date, to: Date) {
    const { history } = await query<{ history: History[] }>(`query
      history($from: DateTime!, $to: DateTime!) {
        history(from: $from, to: $to) {
          id
          date
          state
          plate
          rank
          capacity
          requests
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
    `, { from, to })

    return history
  }
}
