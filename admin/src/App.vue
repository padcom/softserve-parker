<template>
  <v-app>
    <v-app-bar app v-if="isLoggedIn">
      <v-toolbar-title class="headline text-uppercase">
        <span>PARKER</span>
        <span class="font-weight-light">ADMIN PANEL</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/logout">
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import { AuthGetter } from '@/store/auth'

@Component({
})
export default class App extends Vue {
  @AuthGetter isLoggedIn: any
}
</script>
