<template>
  <div class="login">
    <LoginForm id="login" />
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import LoginForm from '@/components/LoginForm'

@Component({
  components: {
    LoginForm
  }
})
export default class Login extends Vue {
}
</script>
