import { Arg, Int, Query, Resolver, Mutation } from 'type-graphql'
import { Roles } from '../../domain/Roles'

@Resolver(Roles)
export class RolesResolver {
  @Query(() => [Roles], {
    description: 'Returns all roles',
  })
  async allRoles () {
    // return Roles.getAll()
    return ['regular', 'vip', 'admin']
  }

//   @Query(() => Roles!, {
//     description: 'Returns a given roles',
//   })
//   async roles (
//     @Arg('name', () => String!)
//     name: string,
//   ) {
//     return Roles.getByName(name)
//   }

//   @Mutation(() => Int, {
//     description: 'Returns newly created role'
//   })
//   async createRoles (
//     @Arg('name', () => Int!)
//     name: string
//   ) {
//     return Roles.create(name)
//   }

//   @Mutation(() => Int, {
//     description: 'Update roles'
//   })

//   async updateRoles (
//     @Arg('name', () => String!)
//     name: string
//   ) {
//     return Roles.update(name)
//   }

//   @Mutation(() => Int, {
//     description: 'Remove role'
//   })
//   async removeRoles (
//     @Arg('id', () => String!)
//     id: string,
//   ) {
//     return Roles.deleteByID(id)
//   }
}
