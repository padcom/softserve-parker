<template>
  <div class="home-page">
    <Title text="Parking dates" borderBottom />
    <div class="home-page__content">
      <div class="home-page__content__dates" v-if="loading === false">
        <ParkingDates :dates="requests" />
      </div>

      <div class="container">
        <div class="home-page__content__actions">
          <Btn outlined text="pick tomorrow" fullWidth />
          <Btn text="pick a parking date" fullWidth />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import Title from '../components/Title'
import Btn from '../components/Btn'
import ParkingDates from '../components/ParkingDates/ParkingDates'

import {
  ReservationRequestsState,
  ReservationRequestsAction
} from '@/store/reservationRequests'

@Component({
  components: {
    Btn,
    Title,
    ParkingDates
  }
})
export default class Home extends Vue {
  loading = true

  @ReservationRequestsState requests
  @ReservationRequestsAction getOwnRequests

  async mounted () {
    try {
      await this.getOwnRequests()
      this.loading = false
    } catch (error) {
      this.loading = false
    }
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
    }
  }
}
</style>
