<template>
  <form @submit.prevent="submit">
    <TextField name="email" label="Email" placeholder="Email" v-model="email" fullWidth />

    <TextField
      name="password"
      label="Password"
      type="password"
      placeholder="Password"
      v-model="password"
      fullWidth
    />

    <Btn name="login" type="submit" text="sign in" fullWidth />
  </form>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AuthAction } from '@/store/auth'
import Btn from './Btn'
import TextField from './TextField'
import logger from '../logger'

@Component({
  components: {
    Btn,
    TextField
  }
})
export default class LoginForm extends Vue {
  email = ''
  password = ''

  @AuthAction login

  async submit () {
    try {
      await this.login({ email: this.email, password: this.password })
      this.$router.push('/')
    } catch (error) {
      logger.error('Error while submitting login form', error)
    }
  }
}
</script>
