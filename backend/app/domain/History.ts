import { Field, ID, ObjectType } from 'type-graphql'
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'
import { User } from './User'

@ObjectType({
  description: 'Object representing history entry.',
})
export class History {
  @Field(() => ID)
  id: number

  @Field(() => Date)
  date: Date

  @Field(() => String)
  state: string

  @Field(() => String, { nullable: true })
  plate: string

  @Field(() => Number)
  userId: number

  @Field(() => User)
  user (): Promise<User> {
    return User.getById(this.userId)
  }

  static async create (date: Date, userId: number, plate: string, state = 'used'): Promise<number> {
    const [ result ] = await db.execute(
      'INSERT INTO history (date, userId, plate, state) VALUES (?,?,?,?)',
      [ date, userId, plate, state ]
    ) as OkPacket[];

    if (result.affectedRows !== 1) {
      throw new Error('Unable to create new history entry - reason unknown')
    }

    return result.insertId
  }

  static async getHistorySince (date: Date): Promise<History[]> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT * FROM history WHERE date > ?',
      [ date ]
    )

    return rows as History[]
  }

  static async getHistoryBetween (from: Date, to: Date): Promise<History[]> {
    const [ rows ]: [ RowDataPacket[], FieldPacket[] ] = await db.execute(
      'SELECT * FROM history WHERE date >= ? AND date <= ?',
      [ from, to ]
    )

    return rows as History[]
  }
}
