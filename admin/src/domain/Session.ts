import { query } from '@/graphql'

export interface Session {
  id: string
  token: string
}

export class SessionAPI {
  static async getAllActiveSessions (...fields: string[]) {
    const { sessions } = await query(`query {
      sessions {
        ${fields.join(',')}
      }
    }`)

    return sessions
  }
}
