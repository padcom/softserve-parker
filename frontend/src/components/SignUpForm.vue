<template>
  <form @submit.prevent="submit" class="singup-form">
    <TextField
      name="firstName"
      placeholder="First Name"
      v-model="user.firstName"
      :isValid="user.firstName !== ''"
    />
    <TextField
      name="lasttName"
      placeholder="Last Name"
      v-model="user.lastName"
      :isValid="user.lastName !== ''"
    />
    <EmailField
      name="email"
      placeholder="Email"
      v-model="user.email"
    />
    <TextField
      name="plateNumber"
      placeholder="Plate Number"
      v-model="user.plateNumber"
      :isValid="user.plateNumber !== ''"
    />
    <TextField
      name="phoneNumber"
      placeholder="Phone Number"
      v-model="user.phoneNumber"
      :isValid="user.phoneNumber !== ''"
    />
    <PasswordField
      name="password"
      placeholder="Password"
      v-model="user.password"
      :isValid="user.password.length > 3"
    />
    <PasswordField
      name="passwordConfirmation"
      placeholder="Retype Passwrod"
      v-model="passwordConfirmation"
      :isValid="passwordsAreMatching"
    />
    <Btn name="signup" fullWidth :disabled="!isFormValid()" @click="$emit('submit', user)">
      Sign up
    </Btn>
    <p class="text-center">
      Got account?
      <router-link to="/login">Log in here</router-link>
    </p>
  </form>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import Btn from './Btn'
import TextField from './TextField'
import EmailField from './EmailField'
import PasswordField from './PasswordField'

@Component({
  components: {
    Btn,
    TextField,
    EmailField,
    PasswordField,
  },
})
export default class SignUpForm extends Vue {
  user = {
    firstName: '',
    lastName: '',
    email: '',
    plateNumber: '',
    phoneNumber: '',
    password: '',
  }

  passwordConfirmation = ''

  get passwordsAreMatching () {
    return this.user.password === this.passwordConfirmation
  }

  isFormValid () {
    return (
      this.isFormFilledUp() &&
      this.passwordsAreMatching
    )
  }

  isFormFilledUp () {
    return Boolean(
      this.user.firstName &&
      this.user.lastName &&
      this.user.email &&
      this.user.plateNumber &&
      this.user.phoneNumber &&
      this.user.password &&
      this.passwordConfirmation,
    )
  }
}
</script>

<style lang="scss">
  .singup-form {
    margin: 4rem auto 0 auto;
    width: 95%;
    .text-field {
      .text-field__input {
        padding: 10px;
      }
    }
  }
</style>
