<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Upcoming reservations
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-filter"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>

      <v-data-table class="elevation-1"
        :headers="headers"
        :items="reservations"
        :search="search"
        :loading="loading"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:item.date="{ item }">
          {{ item.date | date }}
        </template>
      </v-data-table>
    </v-card>
    <Information ref="info" />
  </v-container>
</template>

<script lang="ts">
import subMonths from 'date-fns/sub_months'
import endOfDay from 'date-fns/end_of_day'
import addDays from 'date-fns/add_days'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import { Component, Vue } from 'vue-property-decorator'
import Information from '@/components/Information.vue'
import DateSelector from '@/components/DateSelector.vue'
import { RequestAPI, Request } from '../domain/Requests'

@Component({
  components: {
    DateSelector,
    Information,
  },
  filters: {
    date (value: Date) {
      return format(value, 'YYYY-MM-DD HH:mm:ss')
    },
    json (value: any) {
      return JSON.stringify(value, null, 2)
    },
  },
})
export default class UpcomingReservations extends Vue {
  headers = [
    { text: 'Date', align: 'left', sortable: true, value: 'date' },
    { text: 'First name', align: 'left', sortable: true, value: 'user.firstName' },
    { text: 'Last name', align: 'left', sortable: true, value: 'user.lastName' },
    { text: 'Phone', align: 'left', sortable: true, value: 'user.phone' },
    { text: 'Plate', align: 'left', sortable: true, value: 'user.plate' },
  ]

  reservations = [] as Request[]
  startDate = addDays(new Date(), 1)
  openCalendar = false
  loading = false
  search = ''

  mounted () {
    this.load()
  }

  async load () {
    this.loading = true
    const from = this.startDate
    const to = addDays(this.startDate, 100)
    this.reservations = []
    try {
      this.reservations = await RequestAPI.upcoming()
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    } finally {
      this.loading = false
    }
  }

  onDatesChanged () {
    this.openCalendar = false
    this.load()
  }
}
</script>
