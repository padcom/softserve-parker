import { Field, ObjectType } from 'type-graphql'
import { RowDataPacket, OkPacket } from 'mysql'
import { db } from '../db'

@ObjectType({
  description: 'Object representing system settings.',
})
export class Settings {
  @Field(() => Number)
  numberOfParkingSpots: number = 50

  @Field(() => String)
  deadlineHour: string = '18:00'

  @Field(() => String)
  cancelHour: string = '07:00'

  @Field(() => Number)
  daysForCalculation: number = 90

  @Field(() => Number)
  daysForRequests: number = 30

  static async retrieve () {
    const [ results ] = await db.execute(`SELECT name, value FROM settings`) as RowDataPacket[][]
    const settings = results.reduce((acc, value) => Object.assign({}, acc, { [value.name]: value.value }), {})

    return settings
  }

  static async update (setting, value) {
    const [ result ] = await db.execute('UPDATE settings SET value=? WHERE name=?', [ value.toString(), setting ]) as OkPacket[]

    if (result.affectedRows !== 1) {
      throw new Error('Unable to update setting - reason unknown')
    }

    return value
  }
}
