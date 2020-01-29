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
        <DateSelector label="Select date" v-model="date" @input="load" />
      </v-card-title>
      <v-data-table class="elevation-1"
        :headers="headers"
        :items="history"
        :search="search"
        :loading="loading"
        disable-pagination
        hide-default-footer>
        <template v-slot:item.date="{ item }">
          {{ item.date }}
        </template>
      </v-data-table>
    </v-card>
    <Information ref="info" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Information from '@/components/Information.vue'
import DateSelector from '@/components/DateSelector.vue'
import { History, HistoryAPI } from '@/domain/History'
import { TimeState } from '../store/time'

@Component({
  components: {
    DateSelector,
    Information,
  },
})
export default class ParkingStatus extends Vue {
  headers = [
    { text: 'Date', align: 'left', sortable: true, value: 'date' },
    { text: 'First name', align: 'left', sortable: true, value: 'user.firstName' },
    { text: 'Last name', align: 'left', sortable: true, value: 'user.lastName' },
    { text: 'Email', align: 'left', sortable: true, value: 'user.email' },
    { text: 'Phone', align: 'left', sortable: true, value: 'user.phone' },
    { text: 'Plate', align: 'left', sortable: true, value: 'plate' },
    { text: 'Status', align: 'left', sortable: true, value: 'state' },
  ]

  history = [] as History[]
  search = ''
  date = this.$store.state.time.today
  loading = false

  mounted () {
    this.load()
  }

  async load () {
    this.loading = true
    this.history = []
    try {
      this.history = await HistoryAPI.between(this.date, this.date)
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    } finally {
      this.loading = false
    }
  }
}
</script>
