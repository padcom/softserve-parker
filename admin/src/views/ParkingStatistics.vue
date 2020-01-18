<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Parking utilization statistics
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-filter"
          label="Search"
          single-line
          hide-details />
      </v-card-title>
      <v-card-title>
        <DateSelector label="Select date" v-model="date" @input="onDateChanged" />
      </v-card-title>
      <v-data-table class="elevation-1"
        :headers="headers"
        :items="statistics"
        :search="search"
        :loading="loading"
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
import { Component, Vue } from 'vue-property-decorator'
import Information from '@/components/Information.vue'
import DateSelector from '@/components/DateSelector.vue'
import { Statistics, StatisticsAPI } from '@/domain/Statistics'

@Component({
  components: {
    DateSelector,
    Information,
  },
})
export default class ParkingStatistics extends Vue {
  headers = [
    { text: 'First name', align: 'left', sortable: true, value: 'user.firstName' },
    { text: 'Last name', align: 'left', sortable: true, value: 'user.lastName' },
    { text: 'Email', align: 'left', sortable: true, value: 'user.email' },
    { text: 'Phone', align: 'left', sortable: true, value: 'user.phone' },
    { text: 'Plate', align: 'left', sortable: true, value: 'plate' },
    { text: 'Date', align: 'left', sortable: true, value: 'date' },
    { text: 'Status', align: 'left', sortable: true, value: 'state' },
  ]

  statistics = [] as Statistics[]
  search = ''
  date = new Date()
  openCalendar = false
  loading = false

  mounted () {
    this.load()
  }

  async load () {
    this.loading = true
    const startOfDay = this.date
    const endOfDay = moment(this.date).endOf('day').toDate()
    this.statistics = []
    try {
      this.statistics = await StatisticsAPI.getForDates(startOfDay, endOfDay)
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    } finally {
      this.loading = false
    }
  }

  onDateChanged () {
    this.openCalendar = false
    this.load()
  }

  parseDate (date: string) {
    return moment(new Date(date)).format('YYYY-MM-DD')
  }
}
</script>
