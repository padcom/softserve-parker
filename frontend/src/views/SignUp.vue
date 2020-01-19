<template>
  <section class="singup">
    <SignUpForm v-if="!success && !loading && !error" :onSubmit="createUser" />
    <Loader :loading="loading && !success && !error" />
    <div v-if="success || error" class="singup__done">
      <p v-if="success" class="singup__done__text">Almost there! We've just sent an<br /> email with activation link.</p>
      <p v-if="error" class="singup__done__text">Ups somehting went wrong.</p>
      <Btn @click="redirectToLoginPage" outlined fullWidth>OK</Btn>
    </div>
  </section>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Btn from '../components/Btn'
import Loader from '../components/Loader'
import SignUpForm from '../components/SignUpForm'
import { User } from '../domain/User'

@Component({
  components: {
    Btn,
    Loader,
    SignUpForm,
  },
})
export default class SignUp extends Vue {
  loading = false
  success = false
  error = false

  async createUser (user) {
    try {
      this.loading = true
      await User.create(user.firstName, user.lastName, user.email, user.plateNumber, user.phoneNumber, user.password)
      this.success = true
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
.singup {
  &__done {
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
}
</style>
