import { Query, Arg, Resolver } from 'type-graphql'
import { Statistics } from '../../domain/Statistics'

@Resolver(Statistics)
export class StatisticsResolver {
  @Query(() => [ Statistics ], {
    description: 'Returns parking usage history',
  })
  async statistics (
    @Arg('from', () => Date!)
    from: Date,
    @Arg('to', () => Date!)
    to: Date,
  ) {
    return Statistics.between(from, to)
  }
}
