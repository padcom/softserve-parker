import { Query, Resolver, Authorized } from 'type-graphql'
import { Ranking } from '../../domain/Ranking'

@Resolver(Ranking)
export class RankingResolver {
  @Authorized('admin')
  @Query(() => [ Ranking ], {
    description: 'Returns current ranking',
  })
  async ranking () {
    return Ranking.current()
  }
}
