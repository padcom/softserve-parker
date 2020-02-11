import { query } from '@/graphql'

export interface UserInterface {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  plate: string
  phone: string
  state: string
  roles: string
  rank: number
  description: string
}

export function formatRank (rank: number | undefined): string {
  return rank === undefined || rank === -1 ? '' : String(rank + 1)
}

export class User {
  static async getAll () {
    const { allUsers } = await query<{ allUsers: UserInterface[] }>(`query {
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

  static async updateUser (state: string, firstName: string, lastName: string, plate: string, phone: string, id: number, roles: string, email: string, description: string) {
    const { updateUser } = await query(`mutation updateUser(
        $state: String!,
        $firstName: String!,
        $lastName: String!,
        $plate: String!,
        $phone: String!,
        $roles: String!,
        $description: String
        $email: String!
        $id: ID!,
      ) {
        updateUser(
          state: $state,
          firstName: $firstName,
          lastName: $lastName,
          plate: $plate,
          phone: $phone,
          roles: $roles,
          email: $email,
          description: $description,
          id: $id
        )
      }`,
    {
      state,
      firstName,
      lastName,
      plate,
      phone,
      roles,
      email,
      description,
      id,
    })

    return updateUser
  }

  static async createUser (email: string, password: string, state: string, firstName: string, lastName: string, plate: string, phone: string, roles: string, description: string) {
    const { createUser } = await query(`mutation createUser(
      $email: String!,
      $password: String!,
      $state: String!,
      $firstName: String!,
      $lastName: String!,
      $plate: String!,
      $phone: String!,
      $roles: String!,
      $description: String
    ) {
      createUser(
        email: $email,
        password: $password,
        state: $state,
        firstName: $firstName,
        lastName: $lastName,
        plate: $plate,
        phone: $phone,
        roles: $roles,
        description: $description
      )
    }`,
    {
      email,
      password,
      state,
      firstName,
      lastName,
      plate,
      phone,
      roles,
      description,
    })

    return createUser
  }

  static async removeUser (id: number) {
    const { removeUser } = await query(`mutation removeUser($id: ID!) {
        removeUser(id: $id)
      }`, { id })

    return removeUser
  }

  static async sendConfirmationEmail (id: number) {
    const { sendConfirmationEmail } = await query(`mutation sendConfirmationEmail($id: ID!) {
      sendConfirmationEmail(id: $id)
    }`, { id })

    return sendConfirmationEmail
  }
}
