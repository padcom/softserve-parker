import { query } from '@/graphql'

export interface Settings {
  numberOfParkingSpots: number
  deadlineHour: string
  cancelHour: string
  daysForCalculation: number
  daysForRequests: number
}

export class SettingsAPI {
  async fetchSettings () {
    const { settings } = await query(`query {
      settings {
        numberOfParkingSpots
        deadlineHour
        cancelHour
        daysForCalculation
        daysForRequests
      }
    }`)

    return settings as Settings
  }

  async updateNumberOfParkingSpots (spots: number) {
    const result = await query(`mutation
      setNumberOfParkingSpots($spots: Int!) {
        setNumberOfParkingSpots(spots: $spots)
      }
    `, { spots })

    return result
  }

  async updateDeadlineHour (hour: string) {
    const result = await query(`mutation
    setDeadlineHour($hour: String!) {
      setDeadlineHour(hour: $hour)
    }
  `, { hour })

    return result
  }

  async updateCancelHour (hour: string) {
    const result = await query(`mutation
      setCancelHour($hour: String!) {
        setCancelHour(hour: $hour)
      }
    `, { hour })

    return result
  }

  async updateDaysForCalculation (days: number) {
    const result = await query(`mutation
      setDaysForCalculation($days: Int!) {
        setDaysForCalculation(days: $days)
      }
    `, { days })

    return result
  }

  async updateDaysForRequests (days: number) {
    const result = await query(`mutation
      setDaysForRequests($days: Int!) {
        setDaysForRequests(days: $days)
      }
    `, { days })

    return result
  }
}
