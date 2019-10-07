// https://docs.cypress.io/api/introduction/api.html

describe('Login', () => {
  beforeEach(() => {
    cy.server({ force404: true })
    cy.mockSockJsResponse()
  })

  it("won't login to the application with incorrect data", () => {
    cy.route({
      url: '/login',
      method: 'POST',
      status: 403,
      response: 'Incorrect password'
    })
      .as('login')

    cy.login('johndoe', 'supersecret', { mockLoginRequest: false })
    cy.wait('@login')
    cy.assertRoute('login')
  })

  it('will login to the application', () => {
    cy.login('johndoe', 'supersecret')
    cy.assertRoute('home')
  })

  it('will logout from the application', () => {
    cy.login('johndoe', 'supersecret')
    cy.logout()
    cy.assertRoute('login')
  })
})
