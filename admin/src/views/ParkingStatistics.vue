<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Parking utilization statistics
        <v-spacer />
      </v-card-title>
      <v-card-title>
        <v-container>
          <v-row>
            <DateSelector label="Select start date" v-model="startDate" @input="onDatesChanged" />
            <DateSelector label="Select end date" v-model="endDate" @input="onDatesChanged" />
          </v-row>
        </v-container>
      </v-card-title>

      <DygraphChart :data="chartValues" />

      <v-data-table class="elevation-1"
        :headers="headers"
        :items="statistics"
        :loading="loading"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:item.date="{ item }">
          {{ item.date }}
        </template>
        <template v-slot:item.percentage="{ item }">
          {{ item | percentage }}
        </template>
      </v-data-table>
    </v-card>
    <Information ref="info" />
  </v-container>
</template>

<script lang="ts">
import addDays from 'common/date/addDays'
import format from 'common/date/format'
import { Component, Vue } from 'vue-property-decorator'
import Information from '@/components/Information.vue'
import DateSelector from '@/components/DateSelector.vue'
import { Statistics, StatisticsAPI } from '@/domain/Statistics'
import DygraphChart from '@/components/DygraphChart.vue'
import { TimeState } from '@/store/time'

function getUtilizationPercentage (entry: Statistics): number {
  if (entry.capacity && entry.utilization) {
    return Math.floor(entry.utilization / entry.capacity * 100)
  } else {
    return 0
  }
}

@Component({
  components: {
    DateSelector,
    DygraphChart,
    Information,
  },
  filters: {
    percentage (entry: Statistics) {
      const percentage = getUtilizationPercentage(entry)
      return percentage ? `${percentage}%` : ''
    },
    json (value: any) {
      return JSON.stringify(value, null, 2)
    },
  },
})
export default class ParkingStatistics extends Vue {
  headers = [
    { text: 'Date', align: 'left', sortable: true, value: 'date' },
    { text: 'Capacity', align: 'left', sortable: true, value: 'capacity' },
    { text: 'Number of requests', align: 'left', sortable: true, value: 'requests' },
    { text: 'Utilization', align: 'left', sortable: true, value: 'utilization' },
    { text: 'Percentage', align: 'left', sortable: true, value: 'percentage' },
  ]

  statistics = [] as Statistics[]
  endDate = this.$store.state.time.today
  startDate = addDays(this.endDate, -90)
  openCalendar = false
  loading = false

  mounted () {
    this.load()
  }

  async load () {
    this.loading = true
    this.statistics = []
    try {
      this.statistics = await StatisticsAPI.between(this.startDate, this.endDate)
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

  get chartValues () {
    return this.statistics.map(entry => ([
      new Date(entry.date),
      getUtilizationPercentage(entry),
    ]))
  }
}
</script>
