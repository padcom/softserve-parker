<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Logged in users
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
        :items="sessions"
        :search="search"
        :loading="loading"
        disable-pagination
        hide-default-footer>
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
import { Session, SessionAPI } from '@/domain/Session'

import addDays from 'common/date/addDays'

@Component({
  components: {
    DateSelector,
    Information,
  },
})
export default class ParkingStatus extends Vue {
  headers = [
    { text: 'User ID', align: 'left', sortable: true, value: 'userId' },
    { text: 'email', align: 'left', sortable: true, value: 'email' },
  ]

  sessions = [] as Session[]
  search = ''
  loading = false

  mounted () {
    this.load()
  }

  async load () {
    this.loading = true
    this.sessions = []
    try {
      this.sessions = await SessionAPI.getAllActiveSessions('id', 'userId', 'email')
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    } finally {
      this.loading = false
    }
  }
}
</script>
