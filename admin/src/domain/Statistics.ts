import { query } from '@/graphql'

export interface Statistics {
  id: number
  date: Date
  capacity: number
  requests: number
  utilization: number
}

export class StatisticsAPI {
  static async getForDates (from: Date, to: Date) {
    const { statistics } = await query<{ statistics: Statistics[] }>(`query
    statistics($from: DateTime!, $to: DateTime!) {
      statistics(from: $from, to: $to) {
          date
          capacity
          requests
          utilization
        }
      }
    `, { from, to })

    return statistics
  }
}
