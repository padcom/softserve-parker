<template>
  <form ref="form" @submit.prevent="submit" class="request-password-reset-form">
    <EmailField ref="email" v-model="email" />
    <Btn fullWidth :disabled="!isFormCompleted" @click="submit">Request password reset</Btn>
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
  email = 'mhryn@softserveinc.com'

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
