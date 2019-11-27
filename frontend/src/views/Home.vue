<template>
  <div class="home-page">
    <Modal
      v-if="showModalInfo"
      :actions="infoActions"
      @close="clearInfo"
    >
      {{ infoMessage }}
    </Modal>

    <Title borderBottom>Parking dates</Title>
    <div class="home-page__content">
      <div class="home-page__content__dates" v-if="loading === false">
        <ParkingDates :requests="requests" />
      </div>

      <div class="container">
        <Calendar
          v-if="showCalendar"
          bottom
          :disabledDates="requestsDate"
          :tomorrowWeekendOrAlreadyRequested="tomorrowAlreadyRequested || tommorowWeekendDay"
          @save="calendarPickDate"
          @close="closeCalendar"
        />
        <div class="home-page__content__actions">
          <Btn
            outlined
            text="pick tomorrow"
            fullWidth
            @click="pickTomorrow"
            :disabled="tomorrowAlreadyRequested || tommorowWeekendDay"
          />
          <Btn
            icon="/img/calendar.png"
            text="pick a parking date"
            fullWidth
            @click="openCalendar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import moment from 'moment'

import {
  ReservationRequestsState,
  ReservationRequestsGetter,
  ReservationRequestsAction
} from '@/store/reservationRequests'
import { APP_MESSAGES } from '@/app-statuses'

import Title from '../components/Title'
import Btn from '../components/Btn'
import ParkingDates from '../components/ParkingDates/ParkingDates'
import Calendar from '../components/Calendar/Calendar'
import Modal from '../components/Modal'

@Component({
  components: {
    Btn,
    Title,
    ParkingDates,
    Calendar,
    Modal
  }
})
export default class Home extends Vue {
  loading = true
  showCalendar = false
  showModalInfo = false
  infoMessage = ''
  htmlBody = document.querySelector('body')

  infoActions = [
    {
      outlined: true,
      fullWidth: true,
      emitType: 'close',
      text: 'Close'
    }
  ]

  @ReservationRequestsState requests
  @ReservationRequestsAction getOwnRequests
  @ReservationRequestsAction createRequest
  @ReservationRequestsGetter requestsDate
  @ReservationRequestsGetter tomorrowAlreadyRequested
  @ReservationRequestsGetter tommorowWeekendDay

  async mounted () {
    try {
      await this.getOwnRequests()
      this.loading = false
    } catch (error) {
      this.loading = false
      this.setError(error.message)
      this.showModalInfo = true
    }
  }

  openCalendar () {
    this.htmlBody.classList.add('no-scroll')
    this.showCalendar = true
  }

  closeCalendar () {
    this.htmlBody.classList.remove('no-scroll')
    this.showCalendar = false
  }

  clearInfo () {
    this.showModalInfo = false
  }

  setError (error) {
    this.infoMessage = error
  }

  async pickDate (date) {
    const dateStart = moment(date).startOf('day')
    try {
      this.clearInfo()
      await this.createRequest(dateStart)
      await this.getOwnRequests()
      this.infoMessage = APP_MESSAGES.DATE_REQUESTED
    } catch (error) {
      this.setError(error.message)
    } finally {
      this.showModalInfo = true
    }
  }

  calendarPickDate (date) {
    this.pickDate(date)
    this.closeCalendar()
  }

  pickTomorrow () {
    const tomorrowDate = moment().add(1, 'days')
    this.pickDate(tomorrowDate)
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
