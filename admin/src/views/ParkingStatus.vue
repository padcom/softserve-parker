<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Parking status for {{ date }}; {{ usage }}
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-filter"
          label="Search"
          single-line
          hide-details />
      </v-card-title>
      <v-data-table class="elevation-1"
        :headers="headers"
        :items="history"
        :search="search"
        :loading="loading"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:item.phone="{ item }">
          {{ getValue(item.phone) }}
        </template>
        <template v-slot:item.rank="{ item }">
          {{ item.rank | rank }}
        </template>
        <template v-slot:item.role="{ item }">
          {{ getValue(item.roles) }}
        </template>
        <template v-slot:item.state="{ item }">
          {{ getValue(item.state) }}
        </template>
      </v-data-table>
    </v-card>
    <Information ref="info" />
  </v-container>
</template>

<script lang="ts">
import format from 'date-fns/format'
import startOfDay from 'date-fns/start_of_day'
import endOfDay from 'date-fns/end_of_day'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { User } from '@/domain/User'
import { History, HistoryAPI } from '@/domain/History'
import Information from '@/components/Information.vue'
import { UserInterface, formatRank } from '../domain/User'

@Component({
  components: {
    Information,
  },
  filters: {
    rank: formatRank,
  },
})
export default class ParkingStatus extends Vue {
  headers = [
    { text: 'First Name', align: 'left', sortable: true, value: 'user.firstName' },
    { text: 'Last Name', align: 'left', sortable: true, value: 'user.lastName' },
    { text: 'Phone number', align: 'left', sortable: true, value: 'user.phone' },
    { text: 'Plate number', align: 'left', sortable: true, value: 'plate' },
    { text: 'Role', align: 'left', value: 'user.role' },
    { text: 'State', align: 'left', value: 'state' },
    { text: 'Ranking', align: 'left', value: 'rank' },
  ]

  history = [] as History[]

  search = ''
  loading = false

  async mounted () {
    this.loading = true
    this.history = []
    try {
      const from = startOfDay(new Date())
      const to = endOfDay(new Date())
      this.history = await HistoryAPI.getForDates(from, to)
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    } finally {
      this.loading = false
    }
  }

  get date () {
    return format(new Date(), 'YYYY-MM-DD')
  }

  get usage () {
    return this.history.length > 0 ? `${this.history.length}/${this.history[0].capacity}` : ''
  }

  getValue (data: string): string {
    return !data ? '-' : data
  }
}
</script>
