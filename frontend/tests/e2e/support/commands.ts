// https://on.cypress.io/custom-commands

import LoginForm from '../components/LoginForm'

interface LoginCommandOptions {
  mockLoginRequest: boolean
}

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Method to login user to the system
       *
       * @param username username
       * @param password password
       */
      login (username: string, password: string, options?: LoginCommandOptions): Chainable<Subject>

      /**
       * Navigate to an application route
       *
       * @param route name of the route to navigate to
       * @param params optional parameters for the route
       */
      goto (route: string, params?: any): Chainable<Subject>

      /**
       * Assert the route is as expected
       *
       * @param route name of the route to navigate to
       * @param params optional parameters for the route
       */
      assertRoute (name: string, params?: any): Chainable<Subject>

      /**
       * Mock requests to /sockjs-node
       */
      mockSockJsResponse (): Chainable<Subject>

      /**
       * Mock GraphQL request
       */
      graphql (response: object): Chainable<Subject>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string, options: LoginCommandOptions = { mockLoginRequest: true }) => {
  if (options.mockLoginRequest) {
    console.log('Mocking login request')
    cy.route('POST', '/login', 'JSON-WEB-TOKEN').as('login')
    cy.graphql({ user: { email, rank: 10 } }).as('getLoggedInUser')
  }

  cy.visit('/#/login')
  cy.get('#login').within(el => {
    const loginForm = new LoginForm(el)
    loginForm.login(email, password)
  })
  if (options.mockLoginRequest) {
    cy.wait('@login')
    cy.wait('@getLoggedInUser')
  }
})

Cypress.Commands.add('goto', (route: string, params: any = null) => {
  return cy.window().then(window => {
    // @ts-ignore
    window.app.$router.push({ name: route, params })
  })
})

Cypress.Commands.add('assertRoute', (name: string, params: any = null) => {
  return cy.window().then(window => {
    // @ts-ignore
    console.log('window.app.$route', window.app.$route.name)
    // @ts-ignore
    cy.wrap(window.app.$route.name).should('eq', name)
    if (params) {
      // @ts-ignore
      cy.wrap(window.app.$route.params).should('eq', params)
    }
  })
})

Cypress.Commands.add('mockSockJsResponse', () => {
  return cy.route('/sockjs-node/*', {})
})

Cypress.Commands.add('graphql', (response: object) => {
  return cy.route('POST', '/graphql', response)
})
