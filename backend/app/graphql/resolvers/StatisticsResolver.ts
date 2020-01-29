import { Query, Arg, Resolver } from 'type-graphql'
import { Statistics } from '../../domain/Statistics'

@Resolver(Statistics)
export class StatisticsResolver {
  @Query(() => [ Statistics ], {
    description: 'Returns parking usage history',
  })
  async statistics (
    @Arg('from', () => String!)
    from: string,
    @Arg('to', () => String!)
    to: string,
  ) {
    return Statistics.between(from, to)
  }
}
