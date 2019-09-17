import { Arg, Field, ID, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { ParkingSpotService } from './service'

@ObjectType({
  // In normal graphql, this would be type ParkingSpots { id: ID!, userId: Int }
  description: 'Returns all parking spots. THIS WILL APPEAR IN THE DOCUMENTATION EXPLORER IN APOLLOGRAPHQL. Click "Docs" on the right on localhost:4000',
})
export class ParkingSpots {
  @Field(() => ID)
  id: number

  @Field(() => Int, {
    // if you don't provide () => Int here, the graphql typedefs will make the userId var type equal to 'Float'
    description: 'Field description. This is the userId the parking spot is assigned to',
  })

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
    @Arg('limit', () => Int!, {
      description: 'Method argument description. This is argument limits the amount of rows returned',
    })
    limit: number
  ) {
    return ParkingSpotService.getAll()
  }
}
