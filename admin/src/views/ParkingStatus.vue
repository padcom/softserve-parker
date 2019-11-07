<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Parking status for {{ date }}; Places 68/70
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
        :items="drivers"
        :search="search"
        disable-pagination
        hide-default-footer />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import moment from 'moment'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { User } from '@/domain/User'

@Component
export default class ParkingStatus extends Vue {
  headers = [
    { text: 'First Name', align: 'left', sortable: true, value: 'firstName' },
    { text: 'Last Name', align: 'left', sortable: true, value: 'lasttName' },
    { text: 'Phone number', align: 'left', sortable: true, value: 'phone' },
    { text: 'Plate number', align: 'left', sortable: true, value: 'plate' },
    { text: 'Role', align: 'left', value: 'role' },
    { text: 'State', align: 'left', value: 'state' },
    { text: 'Ranking', align: 'left', value: 'ranking' }
  ]

  drivers = []

  search = ''

  async mounted () {
    try {
      const users = await User.getAll()
      this.drivers = users
    } catch (e) {
      this.drivers = []
    }
  }

  get date () {
    return moment(new Date()).format('YYYY-MM-DD')
  }
}
</script>
