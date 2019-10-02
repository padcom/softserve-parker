import {
  Arg,
  Query,
  Resolver,
} from 'type-graphql'

import { User } from '../../domain/User'

@Resolver(User)
export class UserResolver {
  @Query(() => User!, {
    description: 'Returns a given user',
  })
  async user (
    @Arg('email', () => String!)
    email: string,
  ) {
    return User.getByEmail(email)
  }
}
