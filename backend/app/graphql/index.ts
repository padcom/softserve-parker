import { buildSchema } from 'type-graphql';
import { LaunchResolver } from './typeDefs';

export const schema = buildSchema({ resolvers: [LaunchResolver] });
