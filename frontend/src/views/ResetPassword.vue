<template>
  <section class="reset-password">
    <ResetPasswordForm @submit="resetPassword" />
    <div v-if="error" class="error">{{ error }}</div>
  </section>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Btn from '../components/Btn'
import Loader from '../components/Loader'
import ResetPasswordForm from '../components/ResetPasswordForm'
import { User } from '../domain/User'

@Component({
  components: {
    Btn,
    Loader,
    ResetPasswordForm,
  },
})
export default class ResetPassword extends Vue {
  error = ''

  async resetPassword (password) {
    this.error = ''
    try {
      await User.resetPassword(this.$route.query.token, password)
      this.$router.push('/login')
    } catch (e) {
      if (e.response && e.response.data) {
        this.error = e.response.data
      } else {
        this.error = e
      }
    }
  }
}
</script>

<style lang="scss">
.reset-password {
  display: flex;
  flex-direction: row;
}
</style>
