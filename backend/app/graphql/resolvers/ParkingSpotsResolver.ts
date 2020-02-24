import { Arg, Int, Query, Resolver, Mutation } from 'type-graphql'
import { ParkingSpot } from '../../domain/ParkingSpot'

@Resolver(ParkingSpot)
export class ParkingSpotsResolver {
  @Query(() => [ParkingSpot], {
    description: 'Returns all parking spots up to limit.',
  })
  async parkingspots (
    @Arg('skip', () => Int!, {
      description: 'This argument defines how many rows to skip',
    })
    skip: number,

    @Arg('limit', () => Int!, {
      description: 'This argument limits the amount of rows returned',
    })
    limit: number
  ) {
    return ParkingSpot.fetch(skip, limit)
  }
}
