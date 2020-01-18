import { Field, ID, ObjectType } from 'type-graphql'
import { FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'

@ObjectType({
  description: 'Object representing parking statistics entry.',
})
export class Statistics {
  @Field(() => ID)
  id: number

  @Field(() => Date)
  date: Date

  @Field(() => Number, { nullable: true })
  capacity: number

  @Field(() => String)
  utilization: number

  static async getStatisticsBetween (from: Date, to: Date): Promise<Statistics[]> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT date, capacity, count(id) AS utilization FROM history WHERE date >= ? AND date <= ? GROUP BY date,capacity',
      [ from, to ]
    )

    return rows as Statistics[]
  }
}
