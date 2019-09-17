import { buildSchema } from 'type-graphql'
import { ParkingSpotsResolver } from './collections/example/typeDefs'

const resolvers = [ ParkingSpotsResolver ]

export const schema = buildSchema({ resolvers })
