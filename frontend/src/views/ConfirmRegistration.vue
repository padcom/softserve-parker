<template>
  <section class="registration-confirmation">
    <Loader :loading="!confirmed && !error" />
    <p class="registration-confirmation__text" v-if="error">Something went wrong.</p>
    <p class="registration-confirmation__text" v-if="confirmed">You'r account has been activeted</p>
    <Btn v-if="confirmed" name="ok" text="ok" v-on:click="redirectToLoginPage" outlined fullWidth/>
  </section>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Btn from '../components/Btn'
import Loader from '../components/Loader'
import { AuthAction } from '@/store/auth'

@Component({
  components: {
    Btn,
    Loader
  }
})
export default class ConfirmRegistration extends Vue {
  @AuthAction confirmRegistration
  confirmed = false
  error = false

  async created () {
    try {
      await this.confirmRegistration(Number(this.$route.params.userId))
      this.confirmed = true
    } catch (e) {
      this.error = true
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
