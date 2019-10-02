import { buildSchema } from 'type-graphql'
import { ParkingSpotsResolver } from './resolvers/ParkingSpotsResolver'
import { UserResolver } from './resolvers/UserResolver'

const resolvers = [
  ParkingSpotsResolver,
  UserResolver,
]

export const schema = buildSchema({ resolvers })
