import { Arg, Field, ID, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { ParkingSpotService } from './service'

@ObjectType({
  description: 'Returns all parking spots.',
})
export class ParkingSpots {
  @Field(() => ID)
  id: number

  @Field(() => Boolean)
  reserved: boolean

  @Field(() => Date)
  created: Date
}

@Resolver(ParkingSpots)
export class ParkingSpotsResolver {
  @Query(() => [ ParkingSpots ], {
    description: 'Returns all parking spots up to limit.',
  })
  async parkingspots(
    @Arg('skip', () => Int!, {
      description: 'This is argument defines how many rows to skip',
    })
    skip: number,

    @Arg('limit', () => Int!, {
      description: 'This is argument limits the amount of rows returned',
    })
    limit: number
  )
  {
    return ParkingSpotService.fetch(skip, limit)
  }
}
