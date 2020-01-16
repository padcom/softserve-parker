import { Arg, Int, Query, Resolver, Mutation } from 'type-graphql'
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

  @Mutation(() => Int, {
    description: 'Returns newly created user',
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
    @Arg('phone', () => Int!)
    phone: number,
  ) {
    return User.create(email, password, firstName, lastName, plate, phone)
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
    @Arg('id', () => String!)
    id: string,
    @Arg('phone', () => Int!)
    phone: number,
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
    @Arg('id', () => String!)
    id: string,
  ) {
    return User.deleteByID(id)
  }
}
