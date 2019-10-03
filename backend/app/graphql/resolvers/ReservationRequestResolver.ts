import {
  Arg,
  Int,
  Query,
  Resolver,
  Mutation,
} from 'type-graphql'
import { ReservationRequest } from '../../domain/ReservationRequest'

  
  
    
@Resolver(ReservationRequest)
export class ReservationRequestResolver {
  @Query(() => [ReservationRequest], {
    description: 'Returns list of reservation requests for given user id',
  })
  async reservationRequests(
    @Arg('userId', () => Int!, {
      description: 'This argument defines for which user fetch reservation requests.'
    })
    userId: number,
    @Arg('from', () => Date!, {
      description: 'This argument defines date from which reservation requests will be fetch',
    })
    from: Date,
  ) {
    return ReservationRequest.fetchByUserId(userId, from)
  }
  
  @Mutation(() => [ReservationRequest], {
    description:
      'Creates reservation requests.',
  })
  async createReservationRequest(
    @Arg('userId', () => Int!, {
      description: 'User for which will be created requests.',
    })
    userId: number,
    @Arg('dates', () => [Date!]!, {
      description: 'Dates for which will be created requests.',
    })
    dates: Date[]
  ) {
    return ReservationRequest.createReservationRequest(userId, dates)
  }
}
    