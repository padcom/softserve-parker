import { buildSchema } from 'type-graphql'
import { ParkingSpotsResolver } from './collections/parkingspots'

const resolvers = [ ParkingSpotsResolver ]

export const schema = buildSchema({ resolvers })
