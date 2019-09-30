import { buildSchema } from 'type-graphql'
import { ParkingSpotsResolver } from './parkingspots'
import { UserResolver } from './users'

const resolvers = [
  ParkingSpotsResolver,
  UserResolver,
]

export const schema = buildSchema({ resolvers })
