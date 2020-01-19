<template>
  <section class="request-password-reset">
    <RequestPasswordResetForm @submit="requestPasswordReset" />
    <Loader :loading="loading" />
    <div v-if="error">{{ error }}</div>
  </section>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Btn from '../components/Btn'
import Loader from '../components/Loader'
import RequestPasswordResetForm from '../components/RequestPasswordResetForm'
import { User } from '../domain/User'

@Component({
  components: {
    Btn,
    Loader,
    RequestPasswordResetForm,
  },
})
export default class RequestPasswordReset extends Vue {
  error = ''
  loading = false

  async requestPasswordReset (email) {
    this.error = ''
    try {
      this.loading = true
      await User.requestPasswordReset(email)
      this.$router.push('/reset-link-sent')
    } catch (e) {
      this.error = e.message
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
.request-password-reset {
  margin-top: 30px;
}
</style>
