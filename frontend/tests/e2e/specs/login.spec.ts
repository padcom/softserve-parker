// https://docs.cypress.io/api/introduction/api.html

describe('Login', () => {
  beforeEach(() => {
    cy.server()
  })

  it('will login to the application', () => {
    cy.login('johndoe', 'supersecret')
    cy.location('hash').should('eq', '#/')
  })

  it('will logout from the application', () => {
    cy.login('johndoe', 'supersecret')
    cy.goto('logout')
    cy.location('hash').should('eq', '#/login')
  })
})
