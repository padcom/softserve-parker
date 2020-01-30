<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        User's history
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-filter"
          label="Search"
          single-line
          hide-details />
      </v-card-title>
      <v-card-title>
        <v-container>
          <v-row>
            <DateSelector label="Select start date" v-model="startDate" @input="load" />
            <DateSelector label="Select end date" v-model="endDate" @input="load" />
          </v-row>
        </v-container>
      </v-card-title>
      <v-data-table class="elevation-1"
        :headers="headers"
        :items="requests"
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
import { Component, Watch } from 'vue-property-decorator'
import Information from '@/components/Information.vue'
import DateSelector from '@/components/DateSelector.vue'
import { Request, RequestAPI } from '@/domain/Requests'
import { TimeState } from '@/store/time'
import { User } from '@/domain/User'

import addDays from 'common/date/addDays'

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
    { text: 'Plate', align: 'left', sortable: true, value: 'user.plate' },
    { text: 'Status', align: 'left', sortable: true, value: 'status' },
  ]

  requests = [] as Request[]
  search = ''
  loading = false

  endDate: string = this.$store.state.time.yesterday
  startDate: string = addDays(this.endDate, -7)

  mounted () {
    this.load()
  }

  async load () {
    this.loading = true
    this.requests = []
    try {
      this.requests = await RequestAPI.getAllInDay(this.startDate, this.endDate)
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    } finally {
      this.loading = false
    }
  }
}
</script>
