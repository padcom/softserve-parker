// https://docs.cypress.io/api/introduction/api.html

describe('Login', () => {
  beforeEach(() => {
    cy.server()
  })

  it("won't login to the application with incorrect data", () => {
    cy.login('johndoe', 'supersecret')
    cy.location('pathname').should('not.eq', '/')
  })

  it('will login to the application', () => {
    cy.route('POST', '/login', 'token')

    cy.login('johndoe', 'supersecret')
    cy.location('pathname').should('eq', '/')
  })

  it('will logout from the application', () => {
    cy.route('POST', '/login', 'token')
    cy.login('johndoe', 'supersecret')
    cy.goto('logout')
    cy.location('pathname').should('eq', '/login')
  })
})
