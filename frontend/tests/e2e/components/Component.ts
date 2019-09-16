export default class Component {
  get root (): Cypress.Chainable<JQuery<any>> {
    return cy.wrap(this._root)
  }
}
