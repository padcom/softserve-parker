import {
  Arg,
  Int,
  Query,
  Resolver,
  Mutation,
} from 'type-graphql'
import { ReservationRequest } from '../../domain/ReservationRequest'
import { User } from '../../domain/User'

@Resolver(ReservationRequest)
export class ReservationRequestResolver {
  @Query(() => [ReservationRequest], {
    description: 'Returns all reservation requests in someday',
  })
  async reservationRequestsInDay (
    @Arg('from', () => Date!, {
      description: 'This argument defines date from which reservation requests will be fetch',
    })
    from: Date,
    @Arg('to', () => Date!, {
      description: 'This argument defines date to which reservation requests will be fetch',
    })
    to: Date,
  ) {
    return ReservationRequest.getAllByDay(from, to)
  }

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
    return ReservationRequest.create(userId, dates)
  }

  @Mutation(() => Number)
  async cancelReservationRequest(
    @Arg('id', () => Int!, {
      description: 'Id of request for cancelation'
    })
    id: number
  ) {
    return ReservationRequest.deleteById(id)
  }
}
