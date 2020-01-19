<template>
  <form @submit.prevent="submit" class="singup-form">
    <TextField
      name="firstName"
      placeholder="First Name"
      v-model="user.firstName"
      :isEmpty="!user.firstName"
    />
    <TextField
      name="lasttName"
      placeholder="Last Name"
      v-model="user.lastName"
      :isEmpty="!user.lastName"
    />
    <TextField
      name="email"
      placeholder="Email"
      v-model="user.email"
      :isEmpty="!user.email"
      :isInvalid="markInvalid(user.email, isEmailValid)"
    />
    <TextField
      name="plateNumber"
      placeholder="Plate Number"
      v-model="user.plateNumber"
      :isEmpty="!user.plateNumber"
    />
    <TextField
      name="phoneNumber"
      placeholder="Phone Number"
      v-model="user.phoneNumber"
      :isEmpty="!user.phoneNumber"
    />
    <TextField
      name="password"
      placeholder="Password"
      :type="passwordFieldType"
      v-model="user.password"
      :isEmpty="!user.password"
      :iconSrc="'/img/password-lookup.png'"
      :iconClb="() => { passwordFieldType = switchPasswordVisibility(passwordFieldType) }"
    />
    <TextField
      name="passwordConfirmation"
      :type="passwordConfirmationFieldType"
      placeholder="Retype Passwrod"
      v-model="passwordConfirmation"
      :isEmpty="!passwordConfirmation"
      :isInvalid="markInvalid(passwordConfirmation, passwordsAreMatching)"
      :iconSrc="'/img/password-lookup.png'"
      :iconClb="() => { passwordConfirmationFieldType = switchPasswordVisibility(passwordConfirmationFieldType) }"
    />
    <Btn name="signup" fullWidth :disabled="!isFormValid()" v-on:click="() => onSubmit({...user})">
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

@Component({
  components: {
    Btn,
    TextField,
  },
})
export default class SignUpForm extends Vue {
  @Prop({ type: Function, default: () => {} }) onSubmit
  user = {
    firstName: '',
    lastName: '',
    email: '',
    plateNumber: '',
    phoneNumber: '',
    password: '',
  }

  passwordFieldType = 'password'
  passwordConfirmation = ''
  passwordConfirmationFieldType = 'password'

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
    return !this.user.email || re.test(this.user.email.toLowerCase())
  }

  passwordsAreMatching () {
    return this.user.password === this.passwordConfirmation
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

  switchPasswordVisibility (currentType) {
    return currentType === 'password' ? 'text' : 'password'
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
