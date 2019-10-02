import axios from 'axios'

export async function query (query: string, variables: object = {}) {
  const store = require('@/store').default
  const headers = {
    'Authorization': `Bearer ${store.state.auth.token} `
  }

  return axios
    .post('/graphql', { query, variables }, { headers })
    .then(response => {
      if (!response.data) {
        throw new Error('Unable to get response data - bailing out')
      } else if (response.data.errors) {
        const messages = response.data.errors.map((error: any) => JSON.stringify(error.message))
        throw new Error(messages.join('\n'))
      } else {
        return response.data.data
      }
    })
}
