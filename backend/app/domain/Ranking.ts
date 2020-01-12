import { Field, ID, ObjectType } from 'type-graphql'
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'
import { User } from './User'
import { calculateRanking } from '../engine'

@ObjectType({
  description: 'Object representing ranking entry.',
})
export class Ranking {
  @Field(() => ID)
  id: number

  @Field(() => Date)
  date: Date

  @Field(() => Number)
  rank: number

  @Field(() => Number)
  userId: number

  @Field(() => User)
  user (): Promise<User> {
    return User.getById(this.userId)
  }

  static async getCurrentRanking(): Promise<Ranking[]> {
    const date = new Date()
    const ranking = await calculateRanking()
    return ranking.users.map(user => {
      const entry = new Ranking()
      entry.id = 0
      entry.date = date
      entry.userId = user.id
      entry.rank = user.rank
      return entry
    })
  }
}
