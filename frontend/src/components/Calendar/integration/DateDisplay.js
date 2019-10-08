export default class DateDisplay {
  constructor (main) {
    this.title = main.parentNode.querySelector('.section-title')
    this.title.innerText = ''
    this.label = main.parentNode.querySelector('.section-label')
    this._createSubFields()
  }

  _createSubFields () {
    this.departureText = this._createSpanWithClass('departure-title__departure')
    this.returnText = this._createSpanWithClass('departure-title__return')
    this.title.appendChild(this.departureText)
    this.title.appendChild(this.returnText)
  }

  _createSpanWithClass (className) {
    const result = document.createElement('span')
    result.classList.add(className)

    return result
  }

  setDepartureText (value) {
    this.departureText.innerText = `${value} - `
  }

  setReturnText (value) {
    this.returnText.innerText = value
  }

  highlightDepartureText () {
    this.clearHightligh()
    this.departureText.classList.add('departure-title__departure--active')
  }

  highlightReturnText () {
    this.clearHightligh()
    this.returnText.classList.add('departure-title__return--active')
  }

  clearHightligh () {
    this.departureText.classList.remove('departure-title__departure--active')
    this.returnText.classList.remove('departure-title__return--active')
  }

  showLabel () {
    this.label.classList.add('show')
  }

  hideLabel () {
    this.label.classList.remove('show')
  }
}
