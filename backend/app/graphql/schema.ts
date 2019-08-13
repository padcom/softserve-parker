import { buildSchema } from 'type-graphql';
import { ParkingSpotsResolver } from './collections/launches/typeDefs';

const resolvers = [ParkingSpotsResolver];

export const schema = buildSchema({ resolvers });
