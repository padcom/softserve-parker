<template>
  <v-container class="fill-height" fluid >
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" >
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
            <div class="flex-grow-1" />
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="submit">
              <v-text-field id="email" label="Email" name="email" type="text" v-model="email" />
              <v-text-field id="password" label="Password" name="password" type="password" v-model="password" />
              <div class="error">{{ error }}</div>
              <input type="submit" style="display: none">
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="primary" @click="submit">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'

import { AuthAction } from '@/store/auth'

@Component({
})
export default class Login extends Vue {
  @AuthAction login: any

  email = ''
  password = ''
  error = ''

  @Watch('email') onEmailChanged () {
    this.error = ''
  }

  @Watch('password') onPasswordChanged () {
    this.error = ''
  }

  async submit () {
    this.error = ''
    try {
      await this.login({ email: this.email, password: this.password })
      this.$router.push('/')
    } catch (e) {
      this.error = e.response.data
    }
  }
}
</script>
