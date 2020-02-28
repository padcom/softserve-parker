import { Query, Resolver, Mutation, Arg, Ctx, Int, Authorized } from 'type-graphql'
import { Settings } from '../../domain/Settings'

import { logger } from '../../logger'

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

  @Query(() => String)
  async cancelHour () {
    return Settings.cancelHour()
  }

  @Query(() => Settings!)
  async settings () {
    return Settings.all()
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setNumberOfParkingSpots (
    @Arg('spots', () => Int!)
    spots: number,
    @Ctx()
    context
  ) {
    logger.info(`Requested setNumberOfParkingSpots by ${context.user}`)

    return Settings.update('numberOfParkingSpots', spots)
  }

  @Authorized('admin')
  @Mutation(() => String)
  async setDeadlineHour (
    @Arg('hour', () => String!)
    hour: string,
    @Ctx()
    context
  ) {
    logger.info(`Requested setDeadlineHour by ${context.user}`)

    return Settings.update('deadlineHour', hour)
  }

  @Authorized('admin')
  @Mutation(() => String)
  async setCancelHour (
    @Arg('hour', () => String!)
    hour: string,
    @Ctx()
    context
  ) {
    logger.info(`Requested setCancelHour by ${context.user}`)

    return Settings.update('cancelHour', hour)
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setDaysForCalculation (
    @Arg('days', () => Int!)
    days: number,
    @Ctx()
    context
  ) {
    logger.info(`Requested setDaysForCalculation by ${context.user}`)

    return Settings.update('daysForCalculation', days)
  }

  @Authorized('admin')
  @Mutation(() => Number)
  async setDaysForRequests (
    @Arg('days', () => Int!)
    days: number,
    @Ctx()
    context
  ) {
    logger.info(`Requested setDaysForRequests by ${context.user}`)

    return Settings.update('daysForRequests', days)
  }
}
