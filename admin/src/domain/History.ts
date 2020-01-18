import { query } from '@/graphql'

export interface History {
  id: number
  date: Date
  state: string
  plate: string
  user: {
    firstName: string
    lastName: string
    email: string
    phone: string
    plate: string
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
          user {
            firstName
            lastName
            email
            phone
            plate
          }
        }
      }
    `, { from, to })

    return history
  }
}
