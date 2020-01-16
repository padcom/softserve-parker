import { query } from '@/graphql'

export interface UserInterface {
  firstName: string
  lastName: string
  plate: string
  id: string
  phone: number
  email: string
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

  static async updateUser (firstName: string, lastName: string, plate: string, phone: number, id: string, roles: string) {
    const { updateUser } = await query(`mutation updateUser($firstName: String!, $lastName: String!, $plate: String!, $phone: Int!, $roles: String!, $id: String!) {
        updateUser(firstName: $firstName, lastName: $lastName, plate: $plate, phone: $phone, roles: $roles, id: $id)
      }`, {
      firstName,
      lastName,
      plate,
      id,
      phone: Number(phone),
      roles,
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
