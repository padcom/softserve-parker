import { query } from '@/graphql'
import axios from 'axios'

export class User {
  static async getByEmail (email: string, fields: string[] = [ 'email' ]) {
    const { user } = await query(`query
      User($email: String!) {
        user(email: $email) {
          ${fields.join('\n')}
        }
      }`, { email })

    return user
  }

  static async create (firstName: string, lastName: string, email: string, plate: string, phone: string, password: string) {
    return axios.post('/signup', { firstName, lastName, email, plate, phone, password })
  }

  static async requestPasswordReset (email: string) {
    return axios.post('/password/request-reset-link', { email })
  }

  static async resetPassword (token: string, password: string) {
    return axios.post('/password/reset', { token, password })
  }
}
