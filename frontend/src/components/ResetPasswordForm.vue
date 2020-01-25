<template>
  <form @submit.prevent="submit">
    <PasswordField
      placeholder="Password"
      v-model="password"
      :isValid="isPasswordValid"
    />
    <PasswordField
      placeholder="Retype Passwrod"
      v-model="passwordConfirmation"
      :isValid="isPasswordConfirmationValid"
    />
    <Btn fullWidth :disabled="!isFormCompleted" @click="submit">Update password</Btn>
    <Divider />
  </form>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import Btn from './Btn'
import EmailField from './EmailField'
import PasswordField from './PasswordField'
import Divider from './Divider'

@Component({
  components: {
    Btn,
    PasswordField,
    Divider,
  },
})
export default class ResetPasswordForm extends Vue {
  password = ''
  passwordConfirmation = ''

  get isPasswordValid () {
    return this.password.length > 3
  }

  get isPasswordConfirmationValid () {
    return this.password === this.passwordConfirmation
  }

  get isFormCompleted () {
    return Boolean(
      this.isPasswordValid &&
      this.isPasswordConfirmationValid
    )
  }

  submit () {
    if (this.isFormCompleted) {
      this.$emit('submit', this.password)
    }
  }
}
</script>
