import { query } from '@/graphql'

export interface Statistics {
  id: number
  date: string
  capacity: number
  requests: number
  utilization: number
}

export class StatisticsAPI {
  static async between (from: string, to: string) {
    const { statistics } = await query<{ statistics: Statistics[] }>(`query
    statistics($from: String!, $to: String!) {
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
