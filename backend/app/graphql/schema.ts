import { buildSchema } from 'type-graphql'
import { ParkingSpotsResolver } from './parkingspots'

const resolvers = [
  ParkingSpotsResolver,
]

export const schema = buildSchema({ resolvers })
