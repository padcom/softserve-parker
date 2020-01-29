import { Query, Resolver, Mutation, Arg, Int, Authorized } from 'type-graphql'
import { Settings } from '../../domain/Settings'

@Resolver(Settings)
export class SettingsResolver {
  @Query(() => String)
  async today () {
    return Settings.today()
  }

  @Query(() => String)
  async deadline () {
    return Settings.deadline()
  }

  @Authorized('admin')
  @Query(() => Settings!)
  async settings () {
    return Settings.all()
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setNumberOfParkingSpots (
    @Arg('spots', () => Int!) spots: number
  ) {
    return Settings.update('numberOfParkingSpots', spots)
  }

  @Authorized('admin')
  @Mutation(() => String)
  async setDeadlineHour (
    @Arg('hour', () => String!) hour: string
  ) {
    return Settings.update('deadlineHour', hour)
  }

  @Authorized('admin')
  @Mutation(() => String)
  async setCancelHour (
    @Arg('hour', () => String!) hour: string
  ) {
    return Settings.update('cancelHour', hour)
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setDaysForCalculation (
    @Arg('days', () => Int!) days: number
  ) {
    return Settings.update('daysForCalculation', days)
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setDaysForRequests (
    @Arg('days', () => Int!) days: number
  ) {
    return Settings.update('daysForRequests', days)
  }
}
