import { query } from '@/graphql'

export class RankingAPI {
  static async getRanking (fields: string[] = [ 'id', 'rank' ]) {
    const { ranking } = await query(`query {
      ranking {
        ${fields.join(',')}
      }
    }`)

    return ranking
  }
}
