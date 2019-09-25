<template>
  <form @submit.prevent="submit">
    <TextField
      name="username"
      label="Username"
      placeholder="Username"
      v-model="username"
      fullWidth
    />

    <TextField
      name="password"
      label="Password"
      type="password"
      placeholder="Password"
      v-model="password"
      fullWidth
    />

    <Button type="submit" text="sign in" fullWidth />
  </form>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AuthAction } from '@/store/auth'
import Button from './Button'
import TextField from './TextField'

@Component({
  components: {
    Button,
    TextField
  }
})
export default class LoginForm extends Vue {
  username = ''
  password = ''

  @AuthAction login

  submit() {
    this.login({ username: this.username, password: this.password }).then(
      response => {
        this.$router.push('/')
      }
    )
  }
}
</script>
