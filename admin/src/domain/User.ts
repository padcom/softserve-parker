import { query } from '@/graphql'

export interface UserInterface {
  firstName: string
  lastName: string
  plate: string
  id: string
  phone: number
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

  static async updateUser (firstName: string, lastName: string, plate: string, phone: number, id: string, roles: string, description: string) {
    const { user } = await query(`mutation updateUser(
        $firstName: String!,
        $lastName: String!,
        $plate: String!,
        $phone: Int!,
        $roles: String!,
        $description: String!
        $id: String!,
      ) {
        updateUser(
          firstName: $firstName,
          lastName: $lastName,
          plate: $plate,
          phone: $phone,
          roles: $roles,
          description: $description,
          id: $id
        )
      }`, {
      firstName,
      lastName,
      plate,
      phone: Number(phone),
      roles,
      description,
      id,
    })

    return user
  }

  static async removeUser (id: string) {
    const { removeUser } = await query(`mutation removeUser($id: String!) {
        removeUser(id: $id)
      }`, { id })

    return removeUser
  }
}
