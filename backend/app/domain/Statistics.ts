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

  @Field(() => Number, { nullable: true })
  requests: number

  @Field(() => Number)
  utilization: number

  static async between (from: Date, to: Date): Promise<Statistics[]> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT date, capacity, requests, count(id) AS utilization FROM history WHERE date >= ? AND date <= ? GROUP BY date,capacity,requests',
      [ from, to ]
    )

    return rows as Statistics[]
  }
}
