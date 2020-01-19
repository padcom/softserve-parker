<template>
  <form @submit.prevent="submit" class="singup-form">
    <TextField
      name="password"
      placeholder="Password"
      :type="passwordFieldType"
      v-model="user.password"
      :isEmpty="!user.password"
      :iconSrc="'/img/password-lookup.png'"
      :iconClb="passwordFieldType = switchPasswordVisibility(passwordFieldType)"
    />
    <TextField
      name="passwordConfirmation"
      :type="passwordConfirmationFieldType"
      placeholder="Retype Passwrod"
      v-model="passwordConfirmation"
      :isEmpty="!passwordConfirmation"
      :isInvalid="markInvalid(passwordConfirmation, passwordsAreMatching)"
      :iconSrc="'/img/password-lookup.png'"
      :iconClb="passwordConfirmationFieldType = switchPasswordVisibility(passwordConfirmationFieldType)"
    />
    <Btn name="signup" text="Reset password" fullWidth :disabled="!isFormValid()" @click="submit" />
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
export default class ResetPasswordForm extends Vue {
  @Prop({ type: Number, required: true }) id
  user = {
    id: this.id,
    password: '',
  }
  passwordConfirmation = ''

  passwordFieldType = 'password'
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

  submit () {
    if (this.user.password === this.passwordConfirmation) {
      this.$emit('save', this.user)
    }
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
