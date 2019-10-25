<template>
  <div id="app">
    <OfflineInfo />
    <AppHeader />
    <router-view />
    <Loader :loading="loading" />
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import AppHeader from './components/AppHeader'
import Loader from './components/Loader'
import OfflineInfo from './components/OfflineInfo'
import { AuthGetter } from '@/store/auth'
import { UIState, UIAction } from '@/store/ui'

@Component({
  components: {
    AppHeader,
    Loader,
    OfflineInfo
  }
})
export default class App extends Vue {
  @AuthGetter isLoggedIn
  @UIState loading
  @UIAction startLoading
  @UIAction stopLoading

  mounted () {
    this.$bus.on('request-begin', () => {
      this.startLoading()
    })
    this.$bus.on('request-end', () => {
      this.stopLoading()
    })
  }
}
</script>

<style lang="scss">
@import './styles';

#app {
  position: relative;

  @media (min-width: $md-viewport) {
    max-width: $desktop-width;
    margin: 0 auto;
  }
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
