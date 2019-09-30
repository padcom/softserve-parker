import axios from 'axios'

export async function query (query: string, variables: object = {}) {
  const store = require('@/store').default

  return axios.post('/graphql', {
      query,
      variables
    }, {
      headers: {
        'Authorization': `Bearer ${store.state.auth.token}`
      }
    }
  ).then(response => {
    if (response.data.errors) {
      const messages = response.data.errors.map((error: any) => JSON.stringify(error.message))
      throw new Error(messages.join('\n'))
    } else {
      return response.data
    }
  })
}
