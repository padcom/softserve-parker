<template>
  <section class="registration-confirmation">
    <p v-if="!confirmed && !isFailed">Loader</p>
    <p class="registration-confirmation__text" v-if="isFailed">Something went wrong.</p>
    <p class="registration-confirmation__text" v-if="confirmed">You'r account has been activeted</p>
    <Btn v-if="confirmed" name="ok" text="ok" v-on:click="redirectToLoginPage" outlined fullWidth/>
  </section>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Btn from '../components/Btn'
import { AuthAction } from '@/store/auth'

@Component({
  components: {
    Btn
  }
})
export default class ConfirmRegistration extends Vue {
  @AuthAction confirmRegistration
  confirmed = false
  isFailed = false

  async created () {
    try {
      await this.confirmRegistration(Number(this.$route.params.userId))
      this.confirmed = true
    } catch (e) {
      console.error(e)
      this.isFailed = true
    }
  }

  redirectToLoginPage () {
    this.$router.push('/login')
  }
}
</script>

<style lang="scss">
  .registration-confirmation {
    height: calc(95vh - 65px);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &__text {
      margin-top: auto;
      margin-bottom: auto;
      text-align: center;
    }
  }
</style>
