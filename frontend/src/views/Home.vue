<template>
  <div class="home-page">
    <Modal ref="info" :actions="[ { result: 'ok', text: 'Close' } ]">
      {{ infoMessage }}
    </Modal>

    {{ todayRequest | json }}

    <RequestInformation v-if="isBeforeCancelHour"
      :request="todayRequest"
      @cancel="abandonRequest"
    />
    <LastMinuteNotice v-if="isBeforeCancelHour && hasLostRequest"
      :request="firstAbandonedRequest"
      @takeit="takeLastMinuteSpot"
    />

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
          :maxDate="maxDate"
          @input="requestReservationsForRange"
          @close="closeCalendar"
        />
        <div class="home-page__content__actions">
          <Btn
            outlined
            fullWidth
            transparent
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

import logger from '@/logger'

import Title from '@/components/Title.vue'
import Btn from '@/components/Btn.vue'
import ParkingDates from '@/components/ParkingDates/ParkingDates.vue'
import Calendar from '@/components/Calendar/Calendar.vue'
import Modal from '@/components/Modal.vue'
import RequestInformation from '@/components/RequestInformation.vue'
import LastMinuteNotice from '@/components/LastMinuteNotice.vue'

import { ReservationRequest, ReservationRequestAPI } from '@/domain/ReservationRequest'
import { TimeState, TimeGetter } from '@/store/time'
import { SettingsAPI } from '@/domain/Settings'
import { RequestState, RequestGetter, RequestAction } from '@/store/requests'

import dayOfWeek from 'common/date/dayOfWeek'
import isWeekendDay from 'common/date/isWeekendDay'
import addDays from 'common/date/addDays'

@Component({
  components: {
    Btn,
    Title,
    ParkingDates,
    Calendar,
    Modal,
    LastMinuteNotice,
    RequestInformation,
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
  @RequestState requests
  @RequestGetter pendingRequests
  @RequestGetter todayRequest
  @RequestAction loadRequests

  async loadReservationRequests () {
    this.loading = true
    try {
      await this.loadRequests()
    } catch (e) {
      this.error(e.message)
    } finally {
      this.loading = false
    }
  }

  // --------------------------------------------------------------------------
  // handle Today's date changes
  // --------------------------------------------------------------------------

  @TimeState today
  @TimeState tomorrow
  @TimeGetter isTomorrowWeekend

  @Watch('today')
  async onTodayChanged (newValue) {
    this.loadReservationRequests()
  }

  // --------------------------------------------------------------------------
  // handle asking for request that someone else abandoned
  // --------------------------------------------------------------------------

  @RequestState abandonedRequests
  @RequestGetter firstAbandonedRequest
  @RequestGetter hasLostRequest
  @RequestAction takeLastMinuteRequest

  async takeLastMinuteSpot (request) {
    logger.debug('takeLastMinuteSpot(', request, ')')
    const success = await this.takeLastMinuteRequest(request)
    if (!success) {
      this.infoMessage = 'Too late... Someone has beaten you to it! Sorry!'
      this.$refs.info.show()
    }
  }

  // --------------------------------------------------------------------------
  // handle request abandoning (request has been granted but cancels it)
  // --------------------------------------------------------------------------

  @TimeState now
  @TimeState cancelHour
  @TimeGetter isBeforeCancelHour
  @RequestAction updateRequestStatus
  @RequestAction abandonRequest

  // --------------------------------------------------------------------------
  // handle dates selector
  // --------------------------------------------------------------------------

  selectedRequestDays = null
  showCalendar = false
  numberOfDaysAhead = 10

  get disabledCalendarDates () {
    return this.pendingRequests.map(request => moment(request.date))
  }

  get isTomorrowAlreadyRequested () {
    const request = this.getRequestByDate(this.tomorrow)
    return request && [ '', 'won', 'lost' ].includes(request.status)
  }

  get maxDate () {
    return addDays(this.today, this.numberOfDaysAhead)
  }

  async loadNumberOfDaysAhead () {
    logger.debug('loadNumberOfDaysAhead()')
    this.numberOfDaysAhead = await SettingsAPI.getDaysForRequests()
  }

  openCalendar () {
    logger.debug('openCalendar()')
    this.selectedRequestDays = this.isTomorrowAlreadyRequested || this.isTomorrowWeekend ? null : moment.range(this.tomorrow, this.tomorrow)
    this.showCalendar = true
  }

  closeCalendar () {
    logger.debug('closeCalendar()')
    this.showCalendar = false
  }

  isAlreadyRequested (date) {
    logger.debug('isAlreadyRequested(', date, ')')
    return Boolean(this.getRequestByDate(date))
  }

  isCancelledRequest (date) {
    logger.debug('isCancelledRequest(', date, ')')
    const request = this.getRequestByDate(date)
    return request && request.status === 'cancelled'
  }

  getRequestByDate (date) {
    logger.debug('getRequestByDate(', date, ')')
    return this.requests.find(request => request.date === date)
  }

  async createReservationRequests (dates) {
    logger.debug('createReservationRequests(', dates, ')')
    return Promise.all(
      dates
        .filter(date => !this.isAlreadyRequested(date))
        .map(async (date) => this.createRequestForDate(date))
    )
  }

  async updateReservationRequests (dates, status) {
    logger.debug('updateReservationRequests(', dates, ', ', status, ')')
    return Promise.all(
      dates
        .filter(date => this.isCancelledRequest(date))
        .map(date => this.getRequestByDate(date))
        .map(async (request) => this.updateRequestStatus(request, status))
    )
  }

  async requestReservationsForRange (range) {
    logger.debug('requestReservationsForRange(', range, ')')
    const dates = Array
      .from(range.by('day'))
      .map(date => date.format('YYYY-MM-DD'))
      .filter(date => !isWeekendDay(date))

    await this.createReservationRequests(dates)
    await this.updateReservationRequests(dates, '')
    this.closeCalendar()

    this.info('Parking date(s) requested!')
  }

  async requestReservationsForTomorrow () {
    logger.debug('requestReservationsForTomorrow()')
    await this.requestReservationsForRange(moment.range(this.tomorrow, this.tomorrow))
    this.info('Parking for Tomorrow requested!')
  }

  // --------------------------------------------------------------------------
  // handlers for list of requests
  // --------------------------------------------------------------------------

  @RequestAction cancelRequest

  async cancelReservationRequest (request) {
    await this.cancelRequest(request)
    this.info('Your parking request have been revoked!')
  }

  // --------------------------------------------------------------------------
  // lifecycle methods
  // --------------------------------------------------------------------------

  @RequestAction startRefresherAbandonedRequests
  @RequestAction stopRefresherAbandonedRequests

  mounted () {
    this.loadRequests()
    this.loadNumberOfDaysAhead()
    this.startRefresherAbandonedRequests()
  }

  beforeDestroy () {
    this.stopRefreshingAbandonedRequests()
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
