import axios from 'axios'
import bus from './bus'

export async function query (query: string, variables: object = {}) {
  const store = require('@/store').default
  const headers = {
    'Authorization': `Bearer ${store.state.auth.token} `
  }

  const response = await axios.post('/graphql', { query, variables }, { headers })
  if (!response.data) {
    throw new Error('Unable to get response data - bailing out')
  } else if (response.data.errors) {
    const messages = response.data.errors.map((error: any) => JSON.stringify(error.message))
    throw new Error(messages.join('\n'))
  } else {
    return response.data.data
  }
}
