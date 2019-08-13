import { ApolloServer } from 'apollo-server-express';
import { schema } from '../graphql/schema';
import { logger } from './logger';
const { NODE_ENV } = process.env;
export const apolloServer = schema.then(resolvedSchema => {
  const server = new ApolloServer({
    schema: resolvedSchema,
    introspection: NODE_ENV === 'development',
    playground: NODE_ENV === 'development',
    formatResponse: resp => {
      logger.info(resp);
      return resp;
    },
    formatError: error => {
      logger.error(error);
      return error;
    },
  });
  return server;
});
