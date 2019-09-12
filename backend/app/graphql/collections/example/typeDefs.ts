import { Arg, Field, ID, Int, ObjectType, Query, Resolver } from 'type-graphql'
import { ParkingSpotService } from './service'

/*
 Here we're using TypeGraphQL - a library that joins TypeScript interfaces and GraphQL typedefs together.

 Why?

 Because if we didn't have typegraphql, we would have only TypeScript and plain graphql.
 This means you would need to:

 1. Create graphql typedefs separately
 2. Create ts interfaces separately

 So without TypeGraphQl, it would look like this:

 //personTypedefs.ts
 type Person {
   id: Int!
   name: String!
 }

 //personTypescript.ts
 interface Person {
   id: number,
   name: string
 }

 //personService.ts
 return db.query('SELECT * FROM People') as Person[]


 However with TypeGraphQL, it looks like this:

class People {
  @Field(() => ID)
  id: number

  @Field()
  name: string
}

The class is both a TS interface and a typedef (in one).
*/

@ObjectType({
  //In normal graphql, this would be type ParkingSpots {id: ID!, userId: Int}
  description:
    'Returns all parking spots. THIS WILL APPEAR IN THE DOCUMENTATION EXPLORER IN APOLLOGRAPHQL. Click "Docs" on the right on localhost:4000',
})
export class ParkingSpots {
  @Field(() => ID)
  id: number

  @Field(() => Int, {
    //if you don't provide () => Int here, the graphql typedefs will make the userId var type equal to 'Float'
    description:
      'Field description. This is the userId the parking spot is assigned to',
  })
  userId: number
}

@Resolver(ParkingSpots)
export class ParkingSpotsResolver {
  @Query(() => [ParkingSpots], {
    description: 'Query description. Returns all parking spots up to limit.',
  })
  async parkingspots(
    @Arg('limit', () => Int!, {
      description:
        'Method argument description. This is argument limits the amount of rows returned',
    })
      limit: number
  ) {
    return ParkingSpotService.getAllLimit(limit)
  }
}
