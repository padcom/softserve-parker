import { Query, Resolver } from 'type-graphql'
import { Ranking } from '../../domain/Ranking'

@Resolver(Ranking)
export class RankingResolver {
  @Query(() => [ Ranking ], {
    description: 'Returns current ranking',
  })
  async ranking () {
    return Ranking.getCurrentRanking()
  }
}
