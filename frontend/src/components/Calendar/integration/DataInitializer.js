import moment from 'moment'

import QueryString from '@/utils/QueryString'
import { isValidDate } from '@/utils/moment'

import * as events from '@/events'

import { API } from '@/modules/api'

/**
 * This data is initialized on the first call to /search service
 * and later on used in popups
 */
export const initialData = {
  minDate: null,
  maxDate: null,
  validRanges: null,
  hotelCode: null,
}

/**
 * Base class for all data initializers
 * Binds the instance with calendar and duration fields
 */
class DataInitializer {

  /**
   * Initializes data initializer
   * 
   * @param {Element} main main calendar element
   */
  constructor (main) {
    this.main = main
  }

  disableInitInitialDataEvent () {
    events.searchDataReceived.unsubscribe(this.initInitialData)
  }

  /**
   * This provides easy access to data structure
   */
  get data () {
    return this.main.data
  }

  /**
   * Initialize "initial" data used in popups. This happens only once,
   * therefore the event handler is removed after it is called for the first time
   */
  initInitialData = (e, { minDate, maxDate, validRanges } = e.detail) => {
    this.disableInitInitialDataEvent()

    initialData.minDate = minDate
    initialData.maxDate = maxDate
    initialData.validRanges = validRanges
  }

  /**
   * Initialize calendar data based on /search results
   */
  onDataUpdated = (e, { minDate, maxDate, validRanges } = e.detail) => {
    this.update(minDate, maxDate, validRanges)
  }

  update (minDate, maxDate, validRanges) {
    this.data.validStart = minDate
    this.data.validEnd = maxDate
    this.data.selectedStart = !isValidDate(this.data.selectedStart) ? minDate : moment.max(this.data.selectedStart, minDate)
    this.data.selectedEnd = !isValidDate(this.data.selectedEnd) ? maxDate : moment.min(maxDate, this.data.selectedEnd)
    this.data.displayStart = this.data.selectedStart
    this.data.displayEnd = this.data.selectedEnd
    this.data.validRanges = validRanges
  }

  reset () {
    this.data.selectedStart = initialData.minDate
    this.data.selectedEnd = initialData.maxDate
    this.update(initialData.minDate, initialData.maxDate, initialData.validRanges)
  }
}

/**
 * Default data initializer. Used on home page.
 */
export class DefaultDataInitializer extends DataInitializer {
  constructor (main) {
    super(main)
    this.initialized = false

    this.data.mode = 'start'
    this.data.range = ''

    events.searchDataReceived.subscribe(this.initInitialData)
    events.searchDataReceived.subscribe(this.onDataUpdated)
  }
}

/**
 * Special initializer that uses query string parameters to initialize calendar data
 */
export class ListingPageDataInitializer extends DataInitializer {
  constructor (main, params = new QueryString()) {
    super(main)
    this.params = params

    this.data.mode = this.params.get('DurationInterval') ? 'date' : 'start'
    this.data.range = this.params.get('DurationInterval') || ''
    this.data.selectedStart = moment(this.params.get('DateOfDeparture'), 'YYYYMMDD')
    this.data.selectedEnd = moment(this.params.get('DateOfReturn'), 'YYYYMMDD')

    events.searchDataReceived.subscribe(this.initInitialData)
    events.searchDataReceived.subscribe(this.onDataUpdated)
  }
}

/**
 * Special initializer that uses global initial data to initialize calendar data
 */
export class PopupDataInitializer extends DataInitializer {
  constructor (main) {
    super(main)

    if (initialData.minDate === null || initialData.maxDate === null) {
      log.error('Popup calendar data not initialized!')
    }

    this.data.mode = 'start'
    this.data.range = ''
    this.data.selectedStart = initialData.minDate
    this.data.selectedEnd = initialData.maxDate
    this.data.validStart = initialData.minDate
    this.data.validEnd = initialData.maxDate
    this.data.displayStart = this.data.selectedStart
    this.data.displayEnd = this.data.selectedEnd
    this.data.validRanges = initialData.validRanges

    // Passing hotelCode via initialData is very, very bad. Unfortunatelly there is no
    // other way currently present to pass any data from popups to the data initializer
    // It's one of the points that will need to be addressed when rewriting code to Vue.js,
    // preferably via props, or if that won't be possible, then via Vuex store
    if (initialData.hotelCode) {
      this.loadDataForHotel(initialData.hotelCode)
      initialData.hotelCode = null
    }
  }

  async loadDataForHotel (hotelCode) {
    const response = await new API().getSearchConstraintsForHotelCode(hotelCode)
    log.debug('API RESPONSE', response)
    this.data.selectedStart = response.minDate
    this.data.selectedEnd = response.maxDate
    this.data.validStart = response.minDate
    this.data.validEnd = response.maxDate
    this.data.displayStart = this.data.selectedStart
    this.data.displayEnd = this.data.selectedEnd
    this.data.validRanges = response.validRanges

    return response
  }
}
