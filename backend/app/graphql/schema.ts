import { buildSchema } from 'type-graphql'
import { ParkingSpotsResolver } from './resolvers/ParkingSpotsResolver'
import { UserResolver } from './resolvers/UserResolver'
import { ReservationRequestResolver } from './resolvers/ReservationRequestResolver'
import { SettingsResolver } from './resolvers/SettingsResolver'

const resolvers = [
  SettingsResolver,
  ParkingSpotsResolver,
  UserResolver,
  ReservationRequestResolver
]

export const schema = buildSchema({ resolvers })
