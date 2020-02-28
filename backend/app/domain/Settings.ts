import { Field, ObjectType } from 'type-graphql'
import { RowDataPacket, OkPacket } from 'mysql'
import { db } from '../db'

import { logger } from '../logger'

import parse from 'date-fns/parse'
import isAfter from 'date-fns/isAfter'
import startOfDay from 'date-fns/startOfDay'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'

@ObjectType({
  description: 'Object representing system settings.',
})
export class Settings {
  @Field(() => Number)
  numberOfParkingSpots = 50

  @Field(() => String)
  deadlineHour = '18:00'

  @Field(() => String)
  cancelHour = '07:00'

  @Field(() => Number)
  daysForCalculation = 90

  @Field(() => Number)
  daysForRequests = 30

  static async all () {
    const [ results ] = await db.execute(`SELECT name, value FROM settings`) as RowDataPacket[][]
    const settings = results.reduce((acc, value) => Object.assign({}, acc, { [value.name]: value.value }), {})

    return settings as Settings
  }

  static async update (setting, value) {
    const [ result ] = await db.execute('UPDATE settings SET value=? WHERE name=?', [ value.toString(), setting ]) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to update setting - reason unknown')
    }

    logger.info(`Setting ${setting} updated to value ${value}`)

    return value
  }

  static async deadline () {
    const [ results ] = await db.execute('SELECT value FROM settings WHERE name=?', [ 'deadlineHour' ]) as RowDataPacket[][]

    if (results.length !== 1) {
      throw new Error('Invalid settings')
    }

    return results[0].value
  }

  static async cancelHour () {
    const [ results ] = await db.execute('SELECT value FROM settings WHERE name=?', [ 'cancelHour' ]) as RowDataPacket[][]

    if (results.length !== 1) {
      throw new Error('Invalid settings')
    }

    return results[0].value
  }

  static async today () {
    const deadline = parse(await this.deadline(), 'HH:mm', new Date())
    const today = startOfDay(new Date())
    const tomorrow = startOfDay(addDays(new Date(), 1))
    const date = isAfter(new Date(), deadline) ? tomorrow : today;

    return format(date, 'yyyy-MM-dd')
  }
}
