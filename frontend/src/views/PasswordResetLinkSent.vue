<template>
  <section class="password-reset-link-sent">
    <p class="password-reset-link-sent__text">Password reset link has been sent, please check your email.</p>
    <Btn @click="redirectToLoginPage" outlined fullWidth>OK</Btn>
  </section>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Btn from '@/components/Btn'

@Component({
  components: {
    Btn,
  },
})
export default class PasswordResetLinkSent extends Vue {
  redirectToLoginPage () {
    this.$router.push('/login')
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.password-reset-link-sent {
  height: calc(100vh - #{$header-height});
  position: relative;

  display: flex;
  flex-direction: column;

  &__text {
    margin-top: 30px;
    margin-bottom: 50px;
    margin: auto 10px;
    text-align: center;
  }
}
</style>
