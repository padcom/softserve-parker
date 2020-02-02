import { Arg, Int, Query, Resolver, Mutation } from 'type-graphql'
import { ReservationRequest } from '../../domain/ReservationRequest'

@Resolver(ReservationRequest)
export class ReservationRequestResolver {
  @Query(() => [ ReservationRequest ], {
    description: 'Returns all reservation requests in someday',
  })
  async reservationRequestsInDay (
    @Arg('from', () => String!, {
      description: 'This argument defines date from which reservation requests will be fetch',
    })
    from: string,
    @Arg('to', () => String!, {
      description: 'This argument defines date to which reservation requests will be fetch',
    })
    to: string,
  ) {
    return ReservationRequest.between(from, to)
  }

  @Query(() => [ ReservationRequest ], {
    description: 'Returns list of reservation requests for given user id',
  })
  async reservationRequests (
    @Arg('userId', () => Int!, {
      description: 'This argument defines for which user fetch reservation requests.',
    })
    userId: number,
    @Arg('from', () => String!, {
      description: 'This argument defines date from which reservation requests will be fetch',
    })
    from: string,
  ) {
    return ReservationRequest.byUserId(userId, from)
  }
  
  @Query(() => [ ReservationRequest ], {
    description: 'Returns a list of upcoming reservation requests'
  })
  async upcomingReservations () {
    return ReservationRequest.upcoming()
  }

  @Mutation(() => [ ReservationRequest ], {
    description:
      'Creates reservation requests.',
  })
  async createReservationRequest (
    @Arg('userId', () => Int!, {
      description: 'User for which will be created requests.',
    })
    userId: number,
    @Arg('dates', () => [String!]!, {
      description: 'Dates for which will be created requests.',
    })
    dates: string[]
  ) {
    return ReservationRequest.create(userId, dates)
  }

  @Mutation(() => Number)
  async setReservationRequestStatus (
    @Arg('id', () => Int!, {
      description: 'Id of request for cancelation',
    })
    id: number,
    @Arg('status', () => String!, {
      description: 'New status',
    })
    status: string
  ) {
    return ReservationRequest.updateStatus(id, status)
  }

  @Mutation(() => Boolean!)
  async takeLastMinuteSpot (
    @Arg('abandoned', () => Int!, {
      description: 'Id of abandoned request',
    })
    abandoned: number,
    @Arg('lost', () => Int!, {
      description: 'Id of lost request',
    })
    lost: number,
  ) {
    return ReservationRequest.takeLastMinuteSpot(abandoned, lost)
  }
}
