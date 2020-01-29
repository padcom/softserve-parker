import { Field, ObjectType } from 'type-graphql'
import { User } from './User'
import { calculateCurrentRanking, RankingUser } from '../engine'

function convertRankingUserToRanking (user: RankingUser): Ranking {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const entry = new Ranking()
  entry.id = user.id
  entry.rank = user.rank
  entry.numberOfTimesParked = user.numberOfTimesParked
  entry.requestTimestamp = user.requestTimestamp

  return entry
}

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
  requestTimestamp: Date

  @Field(() => User)
  user (): Promise<User> {
    return User.byId(this.id)
  }

  static async current (): Promise<Ranking[]> {
    const ranking = await calculateCurrentRanking()
    return ranking.users.map(convertRankingUserToRanking)
  }
}
