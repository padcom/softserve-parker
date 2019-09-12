<template>
  <div>
    <label>Username</label>
    <input type="text" name="username" v-model="username" />
    <label>Password</label>
    <input type="password" name="password" v-model="password" />
    <button name="login" @click="submit">Login</button>
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AuthAction } from '@/store/auth'

@Component()
export default class LoginForm extends Vue {
  username = ''
  password = ''

  @AuthAction login

  submit () {
    this.login({ username: this.username, password: this.password })
    this.$router.push('/')
  }
}
</script>
