import {
  Arg,
  Field,
  ID,
  Int,
  ObjectType,
  Query,
  Resolver,
  Mutation,
} from 'type-graphql'
import { ParkingSpotService } from './service'

@ObjectType({
  description: 'Returns all parking spots.',
})
export class ParkingSpot {
  @Field(() => ID)
  id: number

  @Field(() => Boolean)
  reserved: boolean

  @Field(() => Date)
  created: Date
}

@Resolver(ParkingSpot)
export class ParkingSpotsResolver {
  @Query(() => [ParkingSpot], {
    description: 'Returns all parking spots up to limit.',
  })
  async parkingspots(
    @Arg('skip', () => Int!, {
      description: 'This argument defines how many rows to skip',
    })
    skip: number,

    @Arg('limit', () => Int!, {
      description: 'This argument limits the amount of rows returned',
    })
    limit: number
  ) {
    return ParkingSpotService.fetch(skip, limit)
  }

  @Mutation(() => ParkingSpot, {
    description:
      'Updates information whether a parking spot is reserved or not',
  })
  async setParkingSpotReservationStatus(
    @Arg('id', () => Int!, {
      description: 'Parking spot id you want to change',
    })
    id: number,
    @Arg('status', () => Boolean!, {
      description: 'Reservation status you want to change to',
    })
    status: boolean
  ) {
    return ParkingSpotService.setReservation(status, id)
  }
}
