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
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class ParkingStatus extends Vue {
  headers = [
    { text: 'Name', align: 'left', sortable: true, value: 'name' },
    { text: 'Plate number', align: 'left', sortable: true, value: 'plate' },
    { text: 'Mobile number', align: 'left', sortable: true, value: 'phone' }
  ]

  drivers = [
    { id: 1, name: 'Dariusz Tanski', plate: 'SK 3127L', phone: '+48 661 546 889' },
    { id: 2, name: 'Marcin Kosmaty', plate: 'GLI 34252', phone: '+48 234 886 097' },
    { id: 3, name: 'Yuit Kaganec', plate: 'GL 2346H', phone: '+380 385 902 413' },
    { id: 4, name: 'FirstName LastName', plate: 'Text value', phone: '9' },
    { id: 5, name: 'FirstName LastName', plate: 'Text value', phone: '11' },
    { id: 6, name: 'FirstName LastName', plate: 'Text value', phone: '13' },
    { id: 7, name: 'FirstName LastName', plate: 'Text value', phone: '14' },
    { id: 8, name: 'FirstName LastName', plate: 'Text value', phone: '20' },
    { id: 9, name: 'FirstName LastName', plate: 'Text value', phone: '22' },
    { id: 10, name: 'FirstName LastName', plate: 'Text value', phone: '1000' },
    { id: 11, name: 'FirstName LastName', plate: 'Text value', phone: '1000' }
  ]

  search = ''

  get date () {
    return new Date().toLocaleDateString('en')
  }
}
</script>
