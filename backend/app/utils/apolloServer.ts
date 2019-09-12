import { ApolloServer } from 'apollo-server-express'
import { schema } from '../graphql/schema'
import { logger } from './logger'
import { GraphQLFormattedError } from 'graphql'
import lodashGet from 'lodash.get'
const { NODE_ENV } = process.env
export const apolloServer = schema.then(
  (resolvedSchema): ApolloServer => {
    const server = new ApolloServer({
      schema: resolvedSchema,
      introspection: NODE_ENV === 'development',
      playground: NODE_ENV === 'development',
      formatResponse: (resp): unknown => {
        /*
        Introspection queries are gigantic (+200 lines)
        They fill up the terminal with unimportant information.
        Filtering them here.
        */
        const isIntrospectionResponse = lodashGet(resp, 'data.__schema', false)
        const logMessage = isIntrospectionResponse
          ? '[skipping introspection query]'
          : resp
        logger.info(logMessage)
        return resp
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatError: (error): GraphQLFormattedError<Record<string, any>> => {
        logger.error(error)
        return error
      },
    })
    return server
  }
)
