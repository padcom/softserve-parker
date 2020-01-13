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

  @Mutation(() => ParkingSpot, {
    description:
      'Updates information whether a parking spot is reserved or not',
  })
  async setParkingSpotReservationStatus (
    @Arg('id', () => Int!, {
      description: 'Parking spot id you want to change',
    })
    id: number,
    @Arg('status', () => Boolean!, {
      description: 'Reservation status you want to change to',
    })
    status: boolean
  ) {
    return ParkingSpot.setReservation(status, id)
  }
}
