<template>
  <form ref="form" @submit.prevent="submit" class="request-password-reset-form">
    <EmailField ref="email" v-model="email" />
    <Btn fullWidth :disabled="!isFormCompleted" @click="submit">Reset my password</Btn>
  </form>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import Btn from './Btn'
import EmailField from './EmailField'

@Component({
  components: {
    Btn,
    EmailField,
  },
})
export default class RequestPasswordResetForm extends Vue {
  email = ''

  get isFormCompleted () {
    return this.email && this.$refs.email && this.$refs.email.isValid
  }

  submit () {
    if (this.isFormCompleted) {
      this.$emit('submit', this.email)
    }
  }
}
</script>

<style lang="scss">
.request-password-reset-form {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
