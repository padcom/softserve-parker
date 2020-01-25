<template>
  <section class="login-page container">
    <section class="login-page__avatar">
    </section>
    <LoginForm id="login" class="login-page__form"/>
    <router-link class="text-center login-page__forgot-password" to="/forgot">Forgot password?</router-link>
  </section>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import LoginForm from '@/components/LoginForm'
import Avatar from '@/components/Avatar'

@Component({
  components: {
    LoginForm,
    Avatar,
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

  &__forgot-password-link {
    text-align: center;
    display: none;
  }

  &__avatar {
    margin-top: 72px;
    margin-bottom: 82px;
  }

  &__form {
    width: 100%;
    align-self: flex-end;
    padding-bottom: 16px;
  }

  &__forgot-password {
    border-top: 1px solid gray;
    padding-top: 16px;
    padding-bottom: 16px;
  }
}
</style>
