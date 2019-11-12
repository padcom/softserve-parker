import { query } from '@/graphql'

export class User {
  static async getAll () {
    const { allUsers } = await query(`query {
      allUsers {
        id
        firstName
        lastName
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
}
