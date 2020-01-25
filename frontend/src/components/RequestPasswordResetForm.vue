<template>
  <form ref="form" @submit.prevent="submit">
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
