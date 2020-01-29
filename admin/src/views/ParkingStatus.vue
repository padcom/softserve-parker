<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Parking status for {{ today }}; {{ usage }}
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
          {{ item.phone | value }}
        </template>
        <template v-slot:item.rank="{ item }">
          {{ item.rank | rank }}
        </template>
        <template v-slot:item.role="{ item }">
          {{ item.roles | value }}
        </template>
        <template v-slot:item.state="{ item }">
          {{ item.state | value }}
        </template>
      </v-data-table>
    </v-card>
    <Information ref="info" />
  </v-container>
</template>

<script lang="ts">
import format from 'date-fns/format'
import startOfDay from 'date-fns/startOfDay'
import endOfDay from 'date-fns/endOfDay'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { User } from '@/domain/User'
import { History, HistoryAPI } from '@/domain/History'
import Information from '@/components/Information.vue'
import { UserInterface, formatRank } from '../domain/User'
import { TimeState } from '../store/time'

@Component({
  components: {
    Information,
  },
  filters: {
    rank: formatRank,
    value (val: any) {
      return val !== undefined && val !== null ? val : ''
    },
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

  // @ts-ignore
  // @TimeState today: string
  today = '2020-01-24'

  async mounted () {
    this.loading = true
    this.history = []
    try {
      this.history = await HistoryAPI.between(this.today, this.today)
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    } finally {
      this.loading = false
    }
  }

  get usage () {
    return this.history.length > 0 ? `${this.history.length}/${this.history[0].capacity}` : ''
  }
}
</script>
