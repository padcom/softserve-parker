<template>
  <section class="password-reset-link-sent">
    <p class="password-reset-link-sent__text">Almost there! We've just sent an email with activation link.</p>
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
.password-reset-link-sent {
  &__text {
    margin-top: 30px;
    margin-bottom: 50px;
  }
}
</style>
