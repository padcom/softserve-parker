<template>
  <div class="home">
    Hello, {{ user.name }}
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

import { AuthState } from '@/store/auth'

@Component()
export default class Home extends Vue {
  @AuthState user
}
</script>
