<template>
  <div class="login-page container">
    <section class="login-page__avatar">
    </section>

    <section class="login-page__form">
      <LoginForm id="login" />
    </section>

    <router-link class="login-page__forgot-password-link" to="/forgot">Forgot password?</router-link>
  </div>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import LoginForm from '@/components/LoginForm'
import Avatar from '@/components/Avatar'

@Component({
  components: {
    LoginForm,
    Avatar
  }
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
  }

  &__avatar {
    margin-top: 72px;
    margin-bottom: 82px;
  }

  &__form {
    width: 100%;
    align-self: flex-end;
    border-bottom: 1px solid $gray;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }
}
</style>
