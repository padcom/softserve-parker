export async function query (query: string, variables: object) {
  const store = require('@/store').default

  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${store.state.auth.token}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  }).then(response => {
    if (response.ok) return response.json()
    else throw new Error(response.statusText)
  }).then(response => {
    if (response.errors) throw new Error(JSON.stringify(response.errors))
    else return response.data
  })
}
