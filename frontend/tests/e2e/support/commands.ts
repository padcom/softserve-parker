// https://on.cypress.io/custom-commands

import LoginForm from '../components/LoginForm'

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Method to login user to the system
       *
       * @param username username
       * @param password password
       */
      login (username: string, password: string): Chainable<Subject>

      /**
       * Navigate to an application route
       *
       * @param route name of the route to navigate to
       * @param params optional parameters for the route
       */
      goto (route: string, params?: any): Chainable<Subject>

      /**
       * Mock requests to /sockjs-node
       */
      mockSockJsResponse (): Chainable<Subject>
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login')
  cy.get('#login').within(el => {
    const loginForm = new LoginForm(el)
    loginForm.login(username, password)
  })
})

Cypress.Commands.add('goto', (route: string, params: any = null) => {
  // @ts-ignore
  return cy.window().its('app.$router').invoke('push', { name: route, params })
})

Cypress.Commands.add('mockSockJsResponse', () => {
  return cy.route('/sockjs-node/*', {})
})
