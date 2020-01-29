import { Query, Arg, Resolver } from 'type-graphql'
import { History } from '../../domain/History'

@Resolver(History)
export class HistoryResolver {
  @Query(() => [ History ], {
    description: 'Returns parking usage history',
  })
  async history (
    @Arg('from', () => String!)
    from: string,
    @Arg('to', () => String!)
    to: string,
  ) {
    return History.between(from, to)
  }
}
