<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Settings
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field type="number"
            v-model.number="numberOfParkingSpots"
            label="Number of parking spots" />
          <TimePicker
            v-model="deadlineHour"
            label="Time when system will assign parking space to Drivers" />
          <TimePicker
            v-model="cancelHour"
            label="Time when system closes the window for opportunity to cancel reservation and taking cancelled parking reservation" />
          <v-text-field type="number"
            v-model.number="daysForCalculation"
            label="The period of time that is taken into account when calculating the ranking" />
          <v-text-field type="number"
            v-model.number="daysForRequests"
            label="The period of time that is allowed to request dates up front" />
          <input type="submit" style="display: none">
          <v-btn @click="submit">Save settings</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import TimePicker from '@/components/TimePicker.vue'
import { query } from '../graphql'

@Component({
  components: {
    TimePicker
  }
})
export default class Settings extends Vue {
  numberOfParkingSpots = 50
  deadlineHour = '18:00'
  cancelHour = '07:00'
  daysForCalculation = 90
  daysForRequests = 30

  async mounted () {
    const { settings } = await query(`query {
      settings {
        numberOfParkingSpots
        deadlineHour
        cancelHour
        daysForCalculation
        daysForRequests
      }
    }`)

    console.log('SETTINGS:', settings)

    this.numberOfParkingSpots = settings.numberOfParkingSpots
    this.deadlineHour = settings.deadlineHour
    this.cancelHour = settings.cancelHour
    this.daysForCalculation = settings.daysForCalculation
    this.daysForRequests = settings.daysForRequests
  }

  submit () {
    console.log('Saving settings..')
  }
}
</script>
