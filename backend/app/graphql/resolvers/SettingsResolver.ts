import { Query, Resolver, Mutation, Arg, Int, Authorized } from 'type-graphql'
import { Settings } from '../../domain/Settings'

@Resolver(Settings)
export class SettingsResolver {
  @Authorized('admin')
  @Query(() => Settings!)
  async settings () {
    return Settings.retrieve()
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setNumberOfParkingSpots(
    @Arg('spots', () => Int!) spots: number
  ) {
    return Settings.update('numberOfParkingSpots', spots)
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setDeadlineHour(
    @Arg('hour', () => Int!) hour: string
  ) {
    return Settings.update('deadlineHour', hour)
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setCancelHour(
    @Arg('hour', () => Int!) hour: string
  ) {
    return Settings.update('cancelHour', hour)
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setDaysForCalculation(
    @Arg('days', () => Int!) days: number
  ) {
    return Settings.update('daysForCalculation', days)
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setDaysForRequests(
    @Arg('days', () => Int!) days: number
  ) {
    return Settings.update('daysForRequests', days)
  }
}
