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
            label="Number of parking spots"
            @input="modified = true" />
          <TimePicker
            v-model="deadlineHour"
            label="Time when system will assign parking space to Drivers"
            @input="modified = true" />
          <TimePicker
            v-model="cancelHour"
            label="Time when system closes the window of opportunity to cancel reservation and taking cancelled parking reservation"
            @input="modified = true" />
          <v-text-field type="number"
            v-model.number="daysForCalculation"
            label="The period of time that is taken into account when calculating the ranking"
            @input="modified = true" />
          <v-text-field type="number"
            v-model.number="daysForRequests"
            label="The period of time that is allowed to request dates up front"
            @input="modified = true" />
          <input type="submit" style="display: none">
          <v-btn @click="submit">Save settings</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <Information ref="info" />
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import TimePicker from '@/components/TimePicker.vue'
import Information from '@/components/Information.vue'
import { query } from '../graphql'

import { SettingsAPI } from '@/domain/Settings'

@Component({
  components: {
    TimePicker,
    Information,
  },
  beforeRouteLeave (to: any, from: any, next: any) {
    // @ts-ignore
    if (this.modified) {
      const answer = confirm(`Are you sure you want to leave without saving changes?`)
      next(answer)
    } else {
      next()
    }
  },
})
export default class Settings extends Vue {
  numberOfParkingSpots = 50
  deadlineHour = '18:00'
  cancelHour = '07:00'
  daysForCalculation = 90
  daysForRequests = 30

  modified = false

  async mounted () {
    const settings = await (new SettingsAPI().fetchSettings())

    this.numberOfParkingSpots = settings.numberOfParkingSpots
    this.deadlineHour = settings.deadlineHour
    this.cancelHour = settings.cancelHour
    this.daysForCalculation = settings.daysForCalculation
    this.daysForRequests = settings.daysForRequests

    this.modified = false
  }

  async submit () {
    const api = new SettingsAPI()
    try {
      await Promise.all([
        api.updateNumberOfParkingSpots(this.numberOfParkingSpots),
        api.updateDeadlineHour(this.deadlineHour),
        api.updateCancelHour(this.cancelHour),
        api.updateDaysForCalculation(this.daysForCalculation),
        api.updateDaysForRequests(this.daysForRequests),
      ])
      this.modified = false
      // @ts-ignore
      this.$refs.info.showInfo('Settings saved')
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    }
  }
}
</script>
