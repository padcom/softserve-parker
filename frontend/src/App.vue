<template>
  <div id="app">
    <div id="nav" v-if="isLoggedIn">
      <router-link to="/">Home</router-link> |
      <router-link to="/logout">Logout</router-link>
    </div>

    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import { AuthGetter } from '@/store/auth'

@Component()
export default class App extends Vue {
  @AuthGetter isLoggedIn
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
