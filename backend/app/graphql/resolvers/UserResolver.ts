import { Arg, Int, Query, Resolver, Mutation } from 'type-graphql'
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

  @Mutation(() => Int, {
    description: 'Returns newly created user'
  })
  async createUser (
    @Arg('email', () => String!)
    email: string,
    @Arg('password', () => String!)
    password: string,
    @Arg('firstName', () => String!)
    firstName: string,
    @Arg('lastName', () => String!)
    lastName: string, 
    @Arg('plate', () => String!)
    plate: string,
    @Arg('phone', () => Int, {nullable: true})
    phone: number
  ) {
    return User.create(email, password, firstName, lastName, plate, phone)
  }
}

