<template>
  <div class="home-page">
    <Title borderBottom>Parking dates</Title>
    <div class="home-page__content">
      <div class="home-page__content__dates" v-if="loading === false">
        <ParkingDates :requests="requests" />
      </div>

      <div class="container">
        <Calendar :show="showCalendar" bottom @save="calendarPickDate" />
        <div class="home-page__content__actions">
          <Btn outlined text="pick tomorrow" fullWidth @click="pickTomorrow" />
          <Btn text="pick a parking date" fullWidth @click="openCalendar(true)" />
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
  ReservationRequestsAction
} from '@/store/reservationRequests'

import Title from '../components/Title'
import Btn from '../components/Btn'
import ParkingDates from '../components/ParkingDates/ParkingDates'
import Calendar from '../components/Calendar/Calendar'

@Component({
  components: {
    Btn,
    Title,
    ParkingDates,
    Calendar
  }
})
export default class Home extends Vue {
  loading = true
  showCalendar = false

  @ReservationRequestsState requests
  @ReservationRequestsAction getOwnRequests
  @ReservationRequestsAction createRequest

  async mounted() {
    try {
      await this.getOwnRequests()
      this.loading = false
    } catch (error) {
      this.loading = false
    }
  }

  openCalendar(value) {
    this.showCalendar = value
  }

  async pickDate(date) {
    try {
      await this.createRequest(date)
      await this.getOwnRequests()
    } catch (error) {
      // TODO
      console.log('error')
    }
  }

  async calendarPickDate(date) {
    this.pickDate(date)
    this.openCalendar(false)
  }

  async pickTomorrow() {
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
