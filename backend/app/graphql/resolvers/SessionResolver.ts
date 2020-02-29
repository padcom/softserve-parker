import { Query, Resolver, Authorized } from 'type-graphql'
import { Session } from '../../domain/Session'

@Resolver(Session)
export class SessionResolver {
  @Authorized('admin')
  @Query(() => [Session]!)
  async sessions () {
    return Session.all()
  }
}
