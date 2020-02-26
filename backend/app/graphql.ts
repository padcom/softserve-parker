import jwt from 'jsonwebtoken'
import { ApolloServer } from 'apollo-server-express'
import { GraphQLFormattedError } from 'graphql'

import { schema } from './graphql/schema'
import { logger } from './logger'
import { GraphQLContext } from './graphql/context'
import { GraphQLRequestContext, GraphQLRequest, GraphQLResponse } from 'apollo-server-types'
import { isTimeQuery } from './graphql/utils'

const { NODE_ENV } = process.env

export interface TokenData {
  userID: string
  email: string
}

function isIntrospectionResponse (resp: GraphQLResponse): boolean {
  return Boolean(resp?.data?.__schema)
}

function hasRequestUID (request: GraphQLRequest): boolean {
  return request.http.headers.has('uid')
}

export const graphql = schema
  .then((resolvedSchema): ApolloServer => {
    const server = new ApolloServer({
      schema: resolvedSchema,
      introspection: [ 'development' ].includes(NODE_ENV),

      formatResponse: (resp, context): unknown => {
        // Introspection queries are gigantic (+200 lines)
        // They fill up the terminal with unimportant information.
        // Filtering them here.
        // Also filtering responses to requests that have been skipped
        // from logging in the logging.ts (time query and so on)
        if (!isIntrospectionResponse(resp) && hasRequestUID(context.request)) {
          try {
            logger.json('debug', generateLogData(context, resp))
          } catch (e) {
            logger.error(e.message)
          }
        }

        return resp
      },

      formatError: (error): GraphQLFormattedError<Record<string, any>> => {
        logger.error(error)
        return error
      },

      async context ({ req }) {
        if (isTimeQuery(req.body.query)) {
          return {}
        } else {
          const [ , token ] = req.headers.authorization.split(' ')
          const data = jwt.decode(token) as TokenData
          return { user: data.email } as GraphQLContext
        }
      },
    })

    return server
  })
  .catch(logger.error)

function generateLogData(context: GraphQLRequestContext, resp: GraphQLResponse): object {
  const data: any = {
    uid: context.request.http.headers.get('uid'),
    phase: 'data',
  }
  if (resp.data) {
    data.data = JSON.stringify(resp.data)
  }
  if (resp.errors) {
    data.errors = JSON.stringify(resp.errors)
  }

  return data
}
