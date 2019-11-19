<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Parking history
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-filter"
          label="Search"
          single-line
          hide-details />
      </v-card-title>
      <v-card-title>
        <v-menu
          v-model="openCalendar"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="inputDate"
              label="Picker without buttons"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="inputDate"
            :dark="true"
            :allowed-dates='allowedDates'
            first-day-of-week="1"
            @input="onCalendarClose"
            >
          </v-date-picker>
        </v-menu>
      </v-card-title>
      <v-data-table class="elevation-1"
        :headers="headers"
        :items="requests"
        :search="search"
        disable-pagination
        hide-default-footer>
        <template v-slot:item.date="{ item }">
          {{ parseDate(item.date) }}
        </template>
      </v-data-table>
    </v-card>
    <Information ref="info" />
  </v-container>
</template>

<script lang="ts">
import moment from 'moment'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Information from '@/components/Information.vue'
import { Requests } from '@/domain/Requests'

@Component({
  components: {
    Information
  }
})
export default class ParkingStatus extends Vue {
  headers = [
    { text: 'First name', align: 'left', sortable: true, value: 'user.firstName' },
    { text: 'Last name', align: 'left', sortable: true, value: 'user.lastName' },
    { text: 'Email', align: 'left', sortable: true, value: 'user.email' },
    { text: 'Plate', align: 'left', sortable: true, value: 'user.plate' },
    { text: 'Date', align: 'left', sortable: true, value: 'date' },
    { text: 'Status', align: 'left', sortable: true, value: 'status' }
  ]

  requests = []
  search = ''
  inputDate = this.date
  openCalendar = false

  mounted () {
    this.loadRequests()
  }

  async loadRequests () {
    const startOfDay = moment(this.inputDate).toDate()
    const endOfDay = moment(this.inputDate).endOf('day').toDate()
    this.requests = []
    try {
      const requests = await Requests.getAllInDay(startOfDay, endOfDay)
      this.requests = requests
    } catch (e) {
      this.requests = []
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    }
  }

  onCalendarClose () {
    this.openCalendar = false
    this.loadRequests()
  }

  allowedDates (val: string) {
    return ![0, 6].includes(new Date(val).getDay())
  }

  get date () {
    return moment(new Date()).format('YYYY-MM-DD')
  }

  parseDate (date: string) {
    return moment(new Date(date)).format('YYYY-MM-DD')
  }
}
</script>
