import { Arg, Field, ID, Int, ObjectType, Query, Resolver } from 'type-graphql';
import { LaunchService } from './service';

@ObjectType({ description: 'Returns all parking spots' })
export class ParkingSpots {
  @Field(type => ID)
  parking_spot_id: string;

  @Field()
  user_id: number;
}

@Resolver(ParkingSpots)
export class ParkingSpotsResolver {
  @Query(returns => [ParkingSpots])
  async parkingspots(@Arg('first', () => Int) first: number) {
    return LaunchService.launches(first);
  }
}
