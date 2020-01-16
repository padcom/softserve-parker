import { Arg, Int, Query, Resolver, Mutation, ID } from 'type-graphql'
import { User } from '../../domain/User'

@Resolver(User)
export class UserResolver {
  @Query(() => [User], {
    description: 'Returns all users',
  })
  async allUsers () {
    return User.getAll()
  }

  @Query(() => User!, {
    description: 'Returns a given user',
  })
  async user (
    @Arg('email', () => String!)
    email: string,
  ) {
    return User.getByEmail(email)
  }

  @Mutation(() => ID, {
    description: 'Returns newly created user id',
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
    @Arg('phone', () => String!)
    phone: string,
    @Arg('roles', () => String!)
    roles: string,
    @Arg('state', () => String!)
    state: string,
    @Arg('description', () => String, { nullable: true })
    description: string,
  ) {
    const newUserId = await User.create(email, password, firstName, lastName, plate, phone, roles, state, description)
    if (description) {
      await User.updateDescription(newUserId, description)
    }

    return newUserId
  }

  @Mutation(() => Int, {
    description: 'Update user',
  })
  async updateUser (
    @Arg('state', () => String!)
    state: string,
    @Arg('firstName', () => String!)
    firstName: string,
    @Arg('lastName', () => String!)
    lastName: string, 
    @Arg('plate', () => String!)
    plate: string,
    @Arg('id', () => ID!)
    id: number,
    @Arg('phone', () => String!)
    phone: string,
    @Arg('roles', () => String!)
    roles: string,
    @Arg('description', () => String, { nullable: true })
    description: string,
  ) {
    return User.update(id, state, firstName, lastName, plate, phone, roles, description)
  }

  @Mutation(() => Int, {
    description: 'Remove user',
  })
  async removeUser (
    @Arg('id', () => ID!)
    id: number,
  ) {
    return User.deleteByID(id)
  }
}
