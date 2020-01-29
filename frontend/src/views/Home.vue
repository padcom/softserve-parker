<template>
  <div class="home-page">
    <Modal ref="info" :actions="[ { result: 'ok', text: 'Close' } ]">
      {{ infoMessage }}
    </Modal>

    <Title borderBottom>Parking dates</Title>
    <div class="home-page__content">
      <div class="home-page__content__dates" v-if="!loading">
        <ParkingDates :requests="pendingRequests" @revoke="cancelRequest" />
      </div>

      <div class="container">
        <Calendar bottom
          v-if="showCalendar"
          v-model="selectedRequestDays"
          :disabledDates="disabledCalendarDates"
          @input="requestReservationsForRange"
          @close="closeCalendar"
        />
        <div class="home-page__content__actions">
          <Btn
            outlined
            fullWidth
            :disabled="isTomorrowAlreadyRequested || isTomorrowWeekend"
            @click="requestReservationsForTomorrow"
          >
            pick tomorrow
          </Btn>
          <Btn icon="/img/calendar.png" fullWidth @click="openCalendar">
            pick a parking date
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Watch } from 'vue-property-decorator'
import moment from 'moment'

import { AuthState, AuthGetter } from '@/store/auth'
import { UIGetter } from '@/store/ui'

import logger from '../logger'

import Title from '../components/Title'
import Btn from '../components/Btn'
import ParkingDates from '../components/ParkingDates/ParkingDates'
import Calendar from '../components/Calendar/Calendar'
import Modal from '../components/Modal'

import { ReservationRequestAPI } from '../domain/ReservationRequest'
import { TimeState } from '../store/time'

import dayOfWeek from 'common/date/dayOfWeek'

@Component({
  components: {
    Btn,
    Title,
    ParkingDates,
    Calendar,
    Modal,
  },
})
export default class Home extends Vue {
  // --------------------------------------------------------------------------
  // requests modal information display
  // --------------------------------------------------------------------------

  infoMessage = ''

  info (message) {
    this.infoMessage = message
    this.$refs.info.show()
  }

  error (message) {
    this.infoMessage = message
    this.$refs.info.show()
  }

  @AuthState user
  @AuthGetter isLoggedIn

  // --------------------------------------------------------------------------
  // requests handling
  // --------------------------------------------------------------------------

  loading = false
  requests = []

  get pendingRequests () {
    return this.requests.filter(request => request.status === '')
  }

  async loadRequests () {
    logger.debug('loadRequests()')
    this.requests = []
    if (this.isLoggedIn) {
      this.loading = true
      try {
        this.requests = await ReservationRequestAPI.fetchByUserId(this.user.id, this.today)
      } catch (e) {
        this.error(e.message)
      } finally {
        this.loading = false
      }
    }
  }

  async createRequestForDate (date) {
    logger.debug('createRequestForDate(', date, ')')

    try {
      await ReservationRequestAPI.createRequest(this.user.id, date)
      await this.loadRequests()
    } catch (e) {
      this.error(e.message)
      throw e
    }
  }

  async updateRequestStatus (request, status) {
    logger.debug('updateRequestStatus(', request, ',', status, ')')

    try {
      await ReservationRequestAPI.setRequestStatus(request.id, status)
      request.status = status
    } catch (e) {
      this.error(e.message)
      throw e
    }
  }

  // --------------------------------------------------------------------------
  // handle Today's date changes
  // --------------------------------------------------------------------------

  @TimeState today
  @TimeState tomorrow

  @Watch('today')
  async onTodayChanged (newValue) {
    this.loadRequests()
  }

  get isTomorrowWeekend () {
    return [ 0, 6 ].includes(dayOfWeek(this.tomorrow))
  }

  // --------------------------------------------------------------------------
  // handle dates selector
  // --------------------------------------------------------------------------

  selectedRequestDays = null
  showCalendar = false

  get disabledCalendarDates () {
    return this.pendingRequests.map(request => moment(request.date))
  }

  get isTomorrowAlreadyRequested () {
    return this.pendingRequests.some(request => moment(request.date).isSame(moment(this.tomorrow), 'day'))
  }

  openCalendar () {
    this.selectedRequestDays = this.isTomorrowAlreadyRequested || this.isTomorrowWeekend ? null : moment.range(this.tomorrow, this.tomorrow)
    this.showCalendar = true
  }

  closeCalendar () {
    this.showCalendar = false
  }

  isWeekend (date) {
    return [ 0, 6 ].includes(date.day())
  }

  isAlreadyRequested (date) {
    return this.requests.some(request => moment(request.date).isSame(date, 'day'))
  }

  isCancelledRequest (date) {
    return this.requests.some(request => moment(request.date).isSame(date, 'day') && request.status === 'cancelled')
  }

  getRequestByDate (date) {
    return this.requests.find(request => moment(request.date).isSame(date, 'day'))
  }

  async createReservationRequests (dates) {
    return Promise.all(
      dates
        .filter(date => !this.isAlreadyRequested(date))
        .map(async (date) => this.createRequestForDate(date))
    )
  }

  async updateReservationRequests (dates, status) {
    return Promise.all(
      dates
        .filter(date => this.isCancelledRequest(date))
        .map(date => this.getRequestByDate(date))
        .map(async (request) => this.updateRequestStatus(request, status))
    )
  }

  async requestReservationsForRange (range) {
    const dates = Array
      .from(range.by('day'))
      .filter(date => !this.isWeekend(date))
      .map(date => date.format('YYYY-MM-DD'))

    await this.createReservationRequests(dates)
    await this.updateReservationRequests(dates, '')
    this.closeCalendar()

    this.info('Parking date(s) requested!')
  }

  async requestReservationsForTomorrow () {
    await this.requestReservationsForRange(moment.range(this.tomorrow, this.tomorrow))
    this.info('Parking for Tomorrow requested!')
  }

  // --------------------------------------------------------------------------
  // handlers for list of requests
  // --------------------------------------------------------------------------

  async cancelRequest (request) {
    await this.updateRequestStatus(request, 'cancelled')
    this.info('Your parking request have been revoked!')
  }

  // --------------------------------------------------------------------------
  // lifecycle methods
  // --------------------------------------------------------------------------

  mounted () {
    this.loadRequests()
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.home-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - #{$header-height});
  position: relative;

  &__content {
    padding-bottom: 20px;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;

    &__dates {
      flex: 1;
      width: 100%;
    }

    &__actions {
      width: 100%;
      align-self: flex-end;
      margin-top: 20px;
    }
  }
}
</style>
