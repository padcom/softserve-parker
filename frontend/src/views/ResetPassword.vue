<template>
  <section class="container reset-password">
    <ResetPasswordForm @submit="resetPassword" />
    <div v-if="error" class="error">{{ error }}</div>
    <div class="reset-password__links">
      <router-link to="/login">Go back</router-link>
    </div>
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
@import '../styles/variables';

.reset-password {
  height: calc(100vh - #{$header-height});
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 32px;

  &__links {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
