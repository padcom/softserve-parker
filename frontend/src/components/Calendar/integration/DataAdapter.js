import $ from 'jquery'
import moment from 'moment'

export default class DataAdapter {
  constructor (main, title) {
    this.main = main
    this.title = title
    this.form = main.closest('form')
    this.rangeField = this.form.querySelector('.custom-select-duration .section-title')

    Object.defineProperty(this, 'updateQueryString', { value: this.main.dataset.updateQueryString !== 'false' })

    // the order of those properties is important because it is connected
    // to the "assign" method. When that method goes through all properties
    // the selectedStart and selectedEnd must be after displayStart and
    // displayEnd. selectedStart/End are the values we want to have displayed
    // after the assign operation - not displayStart/End which are usualy null
    this.properties = [
      { name: 'mode', setterCallback: () => {} },
      { name: 'validStart', setterCallback: () => {} },
      { name: 'validEnd', setterCallback: () => {} },
      { name: 'displayStart', setterCallback: this._displayStart },
      { name: 'displayEnd', setterCallback: this._displayEnd },
      { name: 'selectedStart', setterCallback: this._updateStart },
      { name: 'selectedEnd', setterCallback: this._updateEnd },
      { name: 'validRanges', setterCallback: () => {} },
      { name: 'range', setterCallback: this._updateRange },
    ].filter(property => property.name)

    this.properties.forEach(this._createProperty.bind(this))
  }

  assign (adapter) {
    this.properties.forEach(property => {
      this[property.name] = adapter[property.name]
    })
  }

  update () {
    this.assign(this)
  }

  _createProperty = ({ name, setterCallback }) => {
    Object.defineProperty(this, name, {
      get: () => {
        const value = this.main.data[`__${name}`]
        log.debug(`Getting property ${name} with value ${value}`)
        return value
      },
      set: value => {
        log.debug(`Setting property ${name} with value ${value}`)
        this.main.data[`__${name}`] = value
        setterCallback(value)
      },
    })
  }

  _updateStart = value => {
    const field = this.main.parentNode.querySelector('.form-group:nth-of-type(1) .form-control')
    const mergedField = this.main.parentNode.querySelector('.form-group:nth-of-type(3) .form-control')
    $(field).val(value.format('DD.MM.YYYY'))
    const selectedEnd = this.main.data.selectedEnd && this.main.data.selectedEnd.format('DD.MM.YYYY')
    $(mergedField).val(`${value.format('DD.MM.YYYY')}:${selectedEnd}`)

    this._displayStart(value)
  }

  _displayStart = value => {
    // this can be a valid date - in this case format it
    try {
      this.title.setDepartureText(value.format('dd DD.MM'))
    } catch (e) {
      // otherwise just display the value
      log.trace(e)
      this.title.setDepartureText(value)
    }
  }

  _updateEnd = value => {
    const field = this.main.parentNode.querySelector('.form-group:nth-of-type(2) .form-control')
    const mergedField = this.main.parentNode.querySelector('.form-group:nth-of-type(3) .form-control')
    $(field).val(value.format('DD.MM.YYYY'))
    const selectedStart = this.main.data.selectedStart && this.main.data.selectedStart.format('DD.MM.YYYY')
    $(mergedField).val(`${selectedStart}:${value.format('DD.MM.YYYY')}`)

    this._displayEnd(value)
  }

  _displayEnd = value => {
    // this can be a valid date - in this case format it
    try {
      if (this.mode !== 'date') {
        if (value.isSame(this.validEnd)) {
          this.title.setReturnText('Przylot do')
        } else if (!value.isSame(moment(0)))
          this.title.setReturnText(value.format('dd DD.MM.YYYY'))
        else
          this.title.setReturnText('')
      }
    } catch (e) {
      // otherwise just display the value
      log.trace(e)
      this.title.setReturnText(value)
    }
  }

  _updateRange = value => {
    const input = this.rangeField.parentNode.querySelector('.form-group input[type="hidden"]')
    const radios = this.rangeField.parentNode.querySelectorAll('.form-group input[type="radio"]')
    input.value = value
    radios.forEach(radio => {
      radio.checked = input.value == radio.value
      if (!radio.checked) {
        radio.removeAttribute('checked')
        radio.classList.remove('checked')
      } else {
        radio.setAttribute('checked', 'checked')
        radio.classList.add('checked')
      }
    })

    this._displayRange(value)
  }

  _displayRange = value => {
    if (this.mode === 'date') {
      if (value)
        this.title.setReturnText(`${value.replace(':', '-')} dni`)
      else
        this.title.setReturnText('Liczba dni')
    }
  }
}
