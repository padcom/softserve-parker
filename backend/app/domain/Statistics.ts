import { Field, ID, ObjectType } from 'type-graphql'
import { FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'

import format from 'common/date/format'

@ObjectType({
  description: 'Object representing parking statistics entry.',
})
export class Statistics {
  @Field(() => ID)
  id: number

  @Field(() => String)
  date: string

  @Field(() => Number, { nullable: true })
  capacity: number

  @Field(() => Number, { nullable: true })
  requests: number

  @Field(() => Number)
  utilization: number

  static async between (from: string, to: string): Promise<Statistics[]> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT date, capacity, requests, count(id) AS utilization FROM history WHERE date BETWEEN ? AND ? GROUP BY date,capacity,requests ORDER BY DATE',
      [ from, to ]
    )

    return rows.map(row =>({ ...row, date: format(row.date) })) as Statistics[]
  }
}
