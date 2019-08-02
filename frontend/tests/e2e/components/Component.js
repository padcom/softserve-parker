export class Component {
  _root = null

  constructor (root) {
    this._root = root
  }

  get root () {
    return cy.wrap(this._root)
  }
}
