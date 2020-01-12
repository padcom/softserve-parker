import { Field, ID, ObjectType } from 'type-graphql'
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql'
import { db } from '../db'
import { User } from './User'
import { calculateRanking } from '../engine'

@ObjectType({
  description: 'Object representing ranking entry.',
})
export class Ranking {
  @Field(() => Number)
  id: number

  @Field(() => Number)
  rank: number

  @Field(() => Number)
  numberOfTimesParked: number

  @Field(() => Date, { nullable: true })
  requestTimeStamp: Date

  @Field(() => User)
  user (): Promise<User> {
    return User.getById(this.id)
  }

  static async getCurrentRanking(): Promise<Ranking[]> {
    const ranking = await calculateRanking()
    return ranking.users.map(user => {
      const entry = new Ranking()
      entry.id = user.id
      entry.rank = user.rank
      entry.numberOfTimesParked = user.numberOfTimesParked
      entry.requestTimeStamp = user.requestTimeStamp
      return entry
    })
  }
}
