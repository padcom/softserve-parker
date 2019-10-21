import { Query, Resolver, Mutation, Arg, Int } from 'type-graphql'
import { Settings } from '../../domain/Settings'

@Resolver(Settings)
export class SettingsResolver {
  @Query(() => Settings!)
  async settings () {
    return Settings.retrieve()
  }

  @Mutation(() => Number)
  async setNumberOfParkingSpots(
    @Arg('spots', () => Int!) spots: number
  ) {
    return Settings.update('numberOfParkingSpots', spots)
  }

  @Mutation(() => Number)
  async setDeadlineHour(
    @Arg('hour', () => Int!) hour: string
  ) {
    return Settings.update('deadlineHour', hour)
  }

  @Mutation(() => Number)
  async setCancelHour(
    @Arg('hour', () => Int!) hour: string
  ) {
    return Settings.update('cancelHour', hour)
  }

  @Mutation(() => Number)
  async setDaysForCalculation(
    @Arg('days', () => Int!) days: number
  ) {
    return Settings.update('daysForCalculation', days)
  }

  @Mutation(() => Number)
  async setDaysForRequests(
    @Arg('days', () => Int!) days: number
  ) {
    return Settings.update('daysForRequests', days)
  }
}
