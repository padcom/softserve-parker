<template>
  <div id="app">
    <AppHeader />
    <router-view />
    <img v-if="!loading" src="/img/loading.gif">
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import AppHeader from './components/AppHeader'
import { AuthGetter } from '@/store/auth'
import { UIState, UIAction } from '@/store/ui'

@Component({
  components: {
    AppHeader
  }
})
export default class App extends Vue {
  @AuthGetter isLoggedIn
  @UIState loading
  @UIAction startLoading
  @UIAction stopLoading

  mounted() {
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
