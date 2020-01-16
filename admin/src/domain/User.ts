import { query } from '@/graphql'

export interface UserInterface {
  firstName: string
  lastName: string
  plate: string
  id: string
  phone: string
  email: string
  state: string
  roles: string
  description: string
}

export class User {
  static async getAll () {
    const { allUsers } = await query(`query {
      allUsers {
        id
        firstName
        lastName
        email
        phone
        plate
        roles
        rank
        state
        description
      }
    }`)

    return allUsers
  }

  static async getByEmail (email: string, fields: string[] = [ 'email' ]) {
    const { user } = await query(`query
      User($email: String!) {
        user(email: $email) {
          ${fields.join('\n')}
        }
      }`, { email })

    return user
  }

  static async updateUser (state: string, firstName: string, lastName: string, plate: string, phone: number, id: string, roles: string, description: string) {
    const { updateUser } = await query(`mutation updateUser(
        $state: String!,
        $firstName: String!,
        $lastName: String!,
        $plate: String!,
        $phone: String!,
        $roles: String!,
        $description: String
        $id: String!,
      ) {
        updateUser(
          state: $state,
          firstName: $firstName,
          lastName: $lastName,
          plate: $plate,
          phone: $phone,
          roles: $roles,
          description: $description,
          id: $id
        )
      }`,
    {
      state,
      firstName,
      lastName,
      plate,
      phone: Number(phone),
      roles,
      description,
      id,
    })

    return updateUser
  }

  static async removeUser (id: string) {
    const { removeUser } = await query(`mutation removeUser($id: String!) {
        removeUser(id: $id)
      }`, { id })

    return removeUser
  }
}
