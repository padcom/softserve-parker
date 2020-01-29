import { Field, ID, ObjectType } from 'type-graphql'
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'
import { User } from './User'

import format from 'common/date/format'

@ObjectType({
  description: 'Object representing history entry.',
})
export class History {
  @Field(() => ID)
  id: number

  @Field(() => String)
  date: string

  @Field(() => Number, { nullable: true })
  capacity?: number

  @Field(() => Number, { nullable: true })
  requests?: number

  @Field(() => String)
  state: string

  @Field(() => String, { nullable: true })
  plate: string

  @Field(() => Number, { nullable: true })
  rank: number

  @Field(() => Number)
  userId: number

  @Field(() => User)
  user (): Promise<User> {
    return User.byId(this.userId)
  }

  private static mapRowsToHistory (rows): History[] {
    return rows.map(row => ({ ...row, date: format(row.date) }))
  }

  static async create (date: string, numberOfParkingSpots: number, numberOfRequests: number, userId: number, plate: string, rank: number, state = 'used'): Promise<number> {
    const [ result ] = await db.execute(
      'INSERT INTO history (date, capacity, requests, userId, plate, `rank`, state) VALUES (?,?,?,?,?,?,?)',
      [ date, numberOfParkingSpots, numberOfRequests, userId, plate, rank, state ]
    ) as OkPacket[];

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new history entry - reason unknown')
    }

    return result.insertId
  }

  static async since (date: string): Promise<History[]> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT * FROM history WHERE date >= ?',
      [ date ]
    )

    return this.mapRowsToHistory(rows)
  }

  static async between (from: string, to: string): Promise<History[]> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT * FROM history WHERE date BETWEEN ? AND ?',
      [ from, to ]
    )

    return this.mapRowsToHistory(rows)
  }
}
