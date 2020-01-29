import axios from 'axios'
import bus from './bus'
import logger from './logger'

export async function query<T> (query: string, variables: object = {}) {
  const router = require('@/router').default
  const token = window.localStorage.getItem('parker:token')

  if (!token && query !== 'query { today, deadline }') {
    bus.emit('clear-credentials')
    await router.push('/login')
    throw new Error('User unauthenticated')
  } else {
    const headers = {
      'Authorization': `Bearer ${token} `,
    }

    const response = await axios.post('/graphql', { query, variables }, { headers })
    if (!response.data) {
      throw new Error('Unable to get response data - bailing out')
    } else if (response.data.errors) {
      const messages = response.data.errors.map((error: any) => JSON.stringify(error.message))
      throw new Error(messages.join('\n'))
    } else {
      logger.debug('GraphQL:', query)
      logger.debug('GraphQL variables:', variables)
      logger.debug('GraphQL result:', response.data.data)
      return response.data.data as T
    }
  }
}
