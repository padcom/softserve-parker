<template>
  <section>
    <form v-if="!success && !loading" @submit.prevent="submit" class="singup">
      <TextField
        name="firstName"
        placeholder="First Name"
        v-model="firstName"
        :isEmpty="!firstName"
      />
      <TextField
        name="lasttName"
        placeholder="Last Name"
        v-model="lastName"
        :isEmpty="!lastName"
      />
      <TextField
        name="email"
        placeholder="Email"
        v-model="email"
        :isEmpty="!email"
        :isInvalid="markInvalid(email, isEmailValid)"
      />
      <TextField
        name="plateNumber"
        placeholder="Plate Number"
        v-model="plateNumber"
        :isEmpty="!plateNumber"
      />
      <TextField
        name="phoneNumber"
        placeholder="Phone Number"
        v-model="phoneNumber"
        :isEmpty="!phoneNumber"
      />
      <TextField
        name="password"
        placeholder="Password"
        :type="passwordFieldType"
        v-model="password"
        :isEmpty="!password"
        :iconSrc="'/img/password-lookup.png'"
        :iconClb="() => { passwordFieldType = passwordFieldType === 'password' ? 'text' : 'password' }"
      />
      <TextField
        name="passwordConfirmation"
        :type="passwordConfirmationFieldType"
        placeholder="Retype Passwrod"
        v-model="passwordConfirmation"
        :isEmpty="!passwordConfirmation"
        :isInvalid="markInvalid(passwordConfirmation, passwordsAreMatching)"
        :iconSrc="'/img/password-lookup.png'"
        :iconClb="() => { passwordConfirmationFieldType = passwordConfirmationFieldType === 'password' ? 'text' : 'password' }"
      />
      <Btn name="signup" text="sign up" fullWidth :disabled="!isFormValid()" v-on:click="createUser" />
      <p class="text-center">
        Got account?
        <router-link to="/login">Log in here</router-link>
      </p>
    </form>
    <div v-if="loading && !success">Loader</div>
    <div v-if="success" class="singup__success">
      <p class="singup__success__text">Almost there! We've just sent an<br /> email with activation link.</p>
      <Btn clas="singup__success__btn" name="ok" text="ok" v-on:click="redirectToLoginPage" outlined fullWidth/>
    </div>
  </section>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Btn from '../components/Btn'
import TextField from '../components/TextField'
import { User } from '../domain/User'

@Component({
  components: {
    Btn,
    TextField
  }
})
export default class SignUp extends Vue {
  firstName = ''
  lastName = ''
  email = ''
  plateNumber = ''
  phoneNumber = null
  password = ''
  passwordFieldType = 'password'
  passwordConfirmation = ''
  passwordConfirmationFieldType = 'password'
  loading = false
  success = false

  markInvalid (field, validationFn) {
    return field ? !validationFn() : false
  }

  isFormValid () {
    return (
      this.isFormFilledUp() &&
      this.passwordsAreMatching() &&
      this.isEmailValid()
    )
  }

  isEmailValid () {
    const re = /@softserveinc.com\s*$/
    return !this.email || re.test(this.email.toLowerCase())
  }

  passwordsAreMatching () {
    return this.password === this.passwordConfirmation
  }

  isFormFilledUp () {
    return Boolean(
      this.firstName &&
      this.lastName &&
      this.email &&
      this.plateNumber &&
      this.phoneNumber &&
      this.password &&
      this.passwordConfirmation
    )
  }

  async createUser () {
    this.loading = true
    await User.create(this.firstName, this.lastName, this.email, this.plateNumber, this.phoneNumber, this.password)
    // this.loading = false
    this.success = true
  }

  redirectToLoginPage () {
    this.$router.push('/login')
  }
}
</script>

<style lang="scss">
.singup {
  margin: 4rem auto 0 auto;
  width: 95%;
  .text-field {
    .text-field__input {
      padding: 10px;
    }
  }

  &__success {
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
