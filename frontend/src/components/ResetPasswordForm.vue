<template>
  <form @submit.prevent="submit" class="singup-form">
    <PasswordField v-model="password" :isValid="isPasswordValid" />
    <PasswordField
      placeholder="Retype Passwrod"
      v-model="passwordConfirmation"
      :isValid="isPasswordConfirmationValid"
    />
    <Btn fullWidth :disabled="!isFormCompleted" @click="submit">Reset password</Btn>
  </form>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import Btn from './Btn'
import EmailField from './EmailField'
import PasswordField from './PasswordField'

@Component({
  components: {
    Btn,
    PasswordField,
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
