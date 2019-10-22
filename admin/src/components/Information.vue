<template>
  <v-snackbar v-model="visible" :timeout="timeout" :color="color" top>
    {{ message }}
    <v-btn @click="visible = false" text>Dismiss</v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Information extends Vue {
  visible = false
  timeout = 10000
  message = ''
  color = 'success'

  showInfo (message: string, timeout = 10000) {
    this.color = 'success'
    this.message = message
    this.timeout = timeout
    this.visible = true
  }

  showError (message: string, timeout = 30000) {
    this.color = 'error'
    this.message = message
    this.timeout = timeout
    this.visible = true
  }
}
</script>
