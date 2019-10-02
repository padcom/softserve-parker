import {
  Arg,
  Field,
  ID,
  Int,
  ObjectType,
  Query,
  Resolver,
  Mutation,
  registerEnumType
} from 'type-graphql'
import { ReservationRequestService } from './'

export enum RequestStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected"
}

registerEnumType(RequestStatus, {
  name: "RequestStatus",
  description: "Request status types",
});

@ObjectType({
  description: 'Object representing reservation request.',
})
export class ReservationRequest {
  @Field(() => ID)
  id: number

  @Field(() => Number)
  userId: number

  @Field(() => Date)
  date: Date

  @Field(() => RequestStatus)
  status: RequestStatus

  @Field(() => Number)
  parkingSpotId: number
}
  
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
    return ReservationRequestService.fetchByUserId(userId, from)
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
    return ReservationRequestService.createReservationRequest(userId, dates)
  }
}
  