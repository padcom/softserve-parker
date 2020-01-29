import axios from 'axios'
import logger from './logger'

export async function query<T> (query: string, variables: object = {}) {
  const store = require('@/store').default
  const headers = {
    'Authorization': `Bearer ${store.state.auth.token} `,
  }

  const result = await axios
    .post('/graphql', { query, variables }, { headers })
    .then(response => {
      if (!response.data) {
        throw new Error('Unable to get response data - bailing out')
      } else if (response.data.errors) {
        const messages = response.data.errors.map((error: any) => JSON.stringify(error.message))
        throw new Error(messages.join('\n'))
      } else {
        return response.data.data as T
      }
    })

  logger.debug('GraphQL:', query)
  logger.debug('GraphQL variables:', variables)
  logger.debug('GraphQL result:', result)

  return result
}
