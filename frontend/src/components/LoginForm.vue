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

    <div v-if="error" class="error">{{ error }}</div>

    <Btn name="login" type="submit" text="sign in" fullWidth />
  </form>
</template>

<script>
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
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
  error = ''

  @Watch('email') onEmailChanged () {
    this.error = ''
  }

  @Watch('password') onPasswordChanged () {
    this.error = ''
  }

  @AuthAction login

  async submit () {
    this.error = ''
    try {
      await this.login({ email: this.email, password: this.password })
      this.$router.push('/')
    } catch (error) {
      this.error = error.response.data
      logger.error('Error while submitting login form', error)
    }
  }
}
</script>

<style lang="scss">
.error {
  color: red;
  margin: 20px 0;
  font-weight: bold;
}
</style>
