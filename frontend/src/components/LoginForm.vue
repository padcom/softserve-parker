<template>
  <form @submit.prevent="submit">
    <EmailField v-model="email" fullWidth />
    <PasswordField placeholder="Password" v-model="password" :isValid="password !== ''" fullWidth />

    <p v-if="error" class="error">{{ error }}</p>

    <Btn type="submit" text="sign in" fullWidth>Login</Btn>
    <p class="signup-link text-center">No account? <router-link to="/signup">Sign up here</router-link></p>
  </form>
</template>

<script>
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { AuthAction } from '@/store/auth'
import Btn from './Btn'
import EmailField from './EmailField'
import PasswordField from './PasswordField'
import logger from '../logger'

@Component({
  components: {
    Btn,
    EmailField,
    PasswordField,
  },
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

  .signup-link {
    margin-top: 2rem;
    margin-bottom: 0;
  }
</style>
