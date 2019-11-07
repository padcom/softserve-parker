<template>
  <v-app>
    <v-navigation-drawer app clipped v-if="isLoggedIn" v-model="drawer">
      <v-list dense>
        <template v-for="item in items">
          <v-list-item :key="item.text" :to="item.url">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left v-if="isLoggedIn">
      <v-toolbar-title class="headline text-uppercase">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span>PARKER</span>
        <span class="font-weight-light">ADMIN PANEL</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/logout">
        <span class="mr-2">Logout</span>
      </v-btn>
    </v-app-bar>

    <div class="loading-bar" v-if="total > 0">
      <div class="progress" :style="loadingIndicatorStyles"></div>
    </div>

    <v-content>
      <router-view />
    </v-content>

  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import { AuthGetter } from '@/store/auth'
import { UIState, UIAction } from './store/ui'

@Component({
})
export default class App extends Vue {
  @AuthGetter isLoggedIn: any

  items = [
    { icon: 'mdi-view-dashboard', text: 'Parking status', url: '/' },
    { icon: 'mdi-comment-text', text: 'Parking history', url: '/parking-history' },
    { icon: 'mdi-account-multiple', text: 'Users', url: '/users' },
    { icon: 'mdi-clipboard-text', text: 'User\'s history', url: '/users-history' },
    { icon: 'mdi-settings', text: 'Settings', url: '/settings' }
  ]

  drawer = null

  // @ts-ignore
  @UIState total
  // @ts-ignore
  @UIState pendingCalls
  // @ts-ignore
  @UIAction beginRequest
  // @ts-ignore
  @UIAction endRequest

  get loadingIndicatorStyles () {
    const width = this.pendingCalls > 0 ? 100 / (this.total / this.pendingCalls) + 'vw' : '0vw'
    return {
      'width': width,
      'transition-duration': '1s'
    }
  }

  mounted () {
    this.$bus.on('request-begin', this.beginRequest)
    this.$bus.on('request-end', this.endRequest)
  }

  beforeDestroy () {
    this.$bus.off('request-begin', this.beginRequest)
    this.$bus.off('request-end', this.endRequest)
  }
}
</script>

<style>
.loading-bar {
  z-index: 1000;
  left: 0px;
  height: 2px;
  top: 0px;
  position: fixed;
  width: 100vw;
  background-color: white;
}
.progress {
  background-color: green;
  position: absolute;
  right: 0px;
  top: 0px;
  height: 1px;
}
</style>
