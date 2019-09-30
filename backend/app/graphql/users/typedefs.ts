import {
  Arg,
  Field,
  ID,
  Query,
  Resolver,
  ObjectType
} from 'type-graphql'

import { UserService } from './service'

@ObjectType({
  description: 'Object representing user.',
})
export class User {
  @Field(() => ID)
  id: number

  @Field(() => String)
  email: string

  @Field(() => Boolean)
  reserved: boolean

  @Field(() => Date)
  created: Date

  @Field(() => String)
  password: string

  @Field(() => Number)
  rank: number

  @Field(() => Boolean)
  enabled: boolean
}

@Resolver(User)
export class UserResolver {
  @Query(() => User, {
    description: 'Returns a given user',
  })
  async user (
    @Arg('email', () => String!)
    email: string,
  ) {
    return UserService.getUserByEmail(email)
  }
}
