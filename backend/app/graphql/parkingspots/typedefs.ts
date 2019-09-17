import { Arg, Field, ID, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { ParkingSpotService } from './service'

@ObjectType({
  // In normal graphql, this would be type ParkingSpots { id: ID!, userId: Int }
  description: 'Returns all parking spots. THIS WILL APPEAR IN THE DOCUMENTATION EXPLORER IN APOLLOGRAPHQL. Click "Docs" on the right on localhost:4000',
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
    description: 'Query description. Returns all parking spots up to limit.',
  })
  async parkingspots(
    @Arg('skip', () => Int!, {
      description: 'Method argument description. This is argument defines how many rows to skip',
    })
    skip: number,
    @Arg('limit', () => Int!, {
      description: 'Method argument description. This is argument limits the amount of rows returned',
    })
    limit: number
  )
  {
    return ParkingSpotService.fetch(skip, limit)
  }
}
