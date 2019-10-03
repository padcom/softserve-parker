import { buildSchema } from 'type-graphql'
import { ParkingSpotsResolver } from './resolvers/ParkingSpotsResolver'
import { UserResolver } from './resolvers/UserResolver'
import { ReservationRequestResolver } from './resolvers/ReservationRequestResolver'
const resolvers = [
  ParkingSpotsResolver,
  UserResolver,
  ReservationRequestResolver
]

export const schema = buildSchema({ resolvers })