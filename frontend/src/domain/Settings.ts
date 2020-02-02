import { query } from '@/graphql'

export class SettingsAPI {
  static async getDaysForRequests () {
    const { settings } = await query(`query { settings { daysForRequests } }`)
    return settings.daysForRequests
  }
}
