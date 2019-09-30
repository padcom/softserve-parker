<template>
  <div id="app">
    <AppHeader />
    <!-- <div id="nav" v-if="isLoggedIn">
      <router-link to="/">Home</router-link>|
      <router-link to="/logout">Logout</router-link>
    </div>-->

    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import AppHeader from './components/AppHeader'
import { AuthGetter } from '@/store/auth'

@Component({
  components: {
    AppHeader
  }
})
export default class App extends Vue {
  @AuthGetter isLoggedIn
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
