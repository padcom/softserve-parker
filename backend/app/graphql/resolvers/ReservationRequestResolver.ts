import { Arg, Ctx, Int, ID, Query, Resolver, Mutation, Authorized } from 'type-graphql'
import { ReservationRequest } from '../../domain/ReservationRequest'

import { logger } from '../../logger'

@Resolver(ReservationRequest)
export class ReservationRequestResolver {
  @Authorized('admin')
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

  @Authorized()
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

  @Authorized('admin')
  @Query(() => [ ReservationRequest ], {
    description: 'Returns a list of upcoming reservation requests'
  })
  async upcomingReservations () {
    return ReservationRequest.upcoming()
  }

  @Authorized()
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
    dates: string[],
    @Ctx()
    context
  ) {
    logger.info(`Requested createReservationRequest by ${context.user}`)

    return ReservationRequest.create(userId, dates)
  }

  @Authorized()
  @Mutation(() => Number)
  async setReservationRequestStatus (
    @Arg('id', () => Int!, {
      description: 'Id of request for cancelation',
    })
    id: number,
    @Arg('status', () => String!, {
      description: 'New status',
    })
    status: string,
    @Ctx()
    context
  ) {
    logger.info(`Requested setReservationRequestStatus by ${context.user}`)

    return ReservationRequest.updateStatus(id, status)
  }

  @Authorized()
  @Mutation(() => Boolean!)
  async takeLastMinuteSpot (
    @Arg('abandoned', () => ID!, {
      description: 'Id of abandoned request',
    })
    abandoned: number,
    @Arg('lost', () => ID!, {
      description: 'Id of lost request',
    })
    lost: number,
    @Ctx()
    context
  ) {
    logger.info(`Requested takeLastMinuteSpot by ${context.user}`)

    return ReservationRequest.takeLastMinuteSpot(abandoned, lost)
  }

  @Authorized()
  @Query(() => [ ReservationRequest! ])
  async abandonedRequests (
    @Arg('date', () => String!)
    date: string,
    @Arg('userId', () => Int!)
    userId: number,
  ) {
    return ReservationRequest.abandonedRequests(date, userId)
  }
}
