import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import 'reflect-metadata'; // required for typegraphql
import { schema } from './graphql';
import { logger } from './utils/logger';

dotenv.config();
const { NODE_ENV, PARKER_PORT } = process.env;

(async function() {
  const server = new ApolloServer({
    schema: await schema,
    debug: NODE_ENV === 'development',
  });

  try {
    const serverParams = await server.listen({ port: PARKER_PORT });
    logger.info(
      `Success! Parker backend started at ${
        serverParams.url
      } in ${NODE_ENV.toUpperCase()} mode`,
    );
  } catch (e) {
    logger.error(`Error! Failed to start Apollo server. Error message: ${e}`);
  }
})();
