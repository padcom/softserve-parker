<template>
  <section class="request-password-reset container">
    <Loader :loading="loading" />
    <div v-if="error">{{ error }}</div>
    <RequestPasswordResetForm @submit="requestPasswordReset" />
    <Divider />
    <div class="request-password-reset__links">
      <router-link to="/login">Go back</router-link>
    </div>
  </section>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Btn from '../components/Btn'
import Loader from '../components/Loader'
import Divider from '@/components/Divider'
import RequestPasswordResetForm from '../components/RequestPasswordResetForm'
import { User } from '../domain/User'

@Component({
  components: {
    Btn,
    Loader,
    Divider,
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
@import '../styles/variables';

.request-password-reset {
  height: calc(100vh - #{$header-height});
  position: relative;
  padding-bottom: 32px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  &__links {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
