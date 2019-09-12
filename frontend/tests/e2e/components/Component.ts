export default class Component {
  constructor (private _root: JQuery<any>) {
  }

  get root (): Cypress.Chainable<JQuery<any>> {
    return cy.wrap(this._root)
  }
}
