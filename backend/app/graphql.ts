import lodashGet from 'lodash.get'
import { ApolloServer } from 'apollo-server-express'
import { GraphQLFormattedError } from 'graphql'

import { schema } from './graphql/schema'
import { logger } from './logger'

const { NODE_ENV } = process.env

export const graphql = schema.then((resolvedSchema): ApolloServer => {
  const server = new ApolloServer({
    schema: resolvedSchema,
    introspection: [ 'development', 'qa' ].includes(NODE_ENV),

    formatResponse: (resp): unknown => {
      // Introspection queries are gigantic (+200 lines)
      // They fill up the terminal with unimportant information.
      // Filtering them here.
      const isIntrospectionResponse = lodashGet(resp, 'data.__schema', false)
      if (!isIntrospectionResponse) {
        logger.info(JSON.stringify(resp))
      }

      return resp
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatError: (error): GraphQLFormattedError<Record<string, any>> => {
      logger.error(error)
      return error
    },
  })

  return server
})
