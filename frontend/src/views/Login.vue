<template>
  <section class="container login-page">
    <div class="login-page__avatar">
      <img src="../assets/circle.svg" class="login-page__avatar-image">
    </div>
    <LoginForm id="login" class="login-page__form"/>
    <Divider />
    <router-link class="text-center login-page__forgot-password" to="/forgot">Forgot password?</router-link>
  </section>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import LoginForm from '@/components/LoginForm'
import Avatar from '@/components/Avatar'
import Divider from '@/components/Divider'

@Component({
  components: {
    LoginForm,
    Avatar,
    Divider,
  },
})
export default class Login extends Vue {}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.login-page {
  display: flex;
  height: calc(100vh - #{$header-height});
  flex-direction: column;
  justify-content: flex-end;

  &__forgot-password-link {
    text-align: center;
    display: none;
  }

  &__avatar {
    margin-top: 16px;
    margin-bottom: 16px;
    height: 100%;
    width: 100%;
  }

  &__avatar-image {
    max-width: 100%;
    max-height: 100%;
  }

  &__form {
    width: 100%;
    align-self: flex-end;
  }

  &__forgot-password {
    padding-bottom: 16px;
  }
}
</style>
