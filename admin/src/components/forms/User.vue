<template>
  <v-card class="user-editor">
    <v-card-title>
      <span class="headline">Edit user</span>
      <div v-if="isUserDeleted" style="font-size: 12px">This user is DELETED and cannot be changed. Change the status to edit.</div>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="12">
            <v-text-field v-model="user.email" label="Email" :error="!isValidEmail(user.email)" :readonly="isUserDeleted" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="user.firstName" label="First name" :error="!user.firstName" :readonly="isUserDeleted" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="user.lastName" label="Last name" :error="!user.lastName" :readonly="isUserDeleted" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="user.phone" type="string" label="Phone number" :error="!user.phone" :readonly="isUserDeleted" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="user.plate" label="Plate number" :error="!user.plate" :readonly="isUserDeleted" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select v-model="user.roles" label="Role" :items="[ 'user', 'admin', 'vip' ]" required :readonly="isUserDeleted"/>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select v-model="user.state" label="State" :items="allowedUserStates" />
          </v-col>
          <v-col cols="12" sm="12">
            <v-textarea v-model="user.description" label="Description" rows="2" counter="255" :error="!isDescriptionValid" :readonly="isUserDeleted" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn text @click="$emit('close')">Cancel</v-btn>
      <v-btn color="blue darken-1" text @click="onSubmit" :disabled="!isFormFilledUp">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'

@Component
export default class UserForm extends Vue {
  @Prop({ type: Object, required: true }) userProp: any

  allowedUserStates = [ 'active', 'inactive' ]

  @Watch('userProp')
  onUserChanged (value: object) {
    this.user = { ...value }
    this.allowedUserStates = this.getAllowedUserStates(this.user.state)
  }

  user = { description: '', ...this.userProp }

  setRole (role: string) {
    this.user.roles = role
  }

  onSubmit () {
    if (this.isFormFilledUp) {
      this.$emit('onSubmit', this.user)
    }
  }

  get isFormFilledUp (): boolean {
    return Boolean(
      this.isValidEmail(this.user.email) &&
      this.user.firstName &&
      this.user.lastName &&
      this.user.plate &&
      this.user.phone &&
      this.user.roles &&
      this.isDescriptionValid
    )
  }

  get isDescriptionValid () {
    return this.user.description === undefined || this.user.description === null || this.user.description.length <= 255
  }

  getAllowedUserStates (currentUserState: string) {
    const result = [ 'active', 'inactive' ]
    if (currentUserState === 'deleted') {
      result.push('deleted')
    }
    return result
  }

  isValidEmail (email: string) {
    const re = /@softserveinc.com\s*$/
    return re.test(email.toLowerCase())
  }

  mounted () {
    this.allowedUserStates = this.getAllowedUserStates(this.user.state)
  }

  get isUserDeleted () {
    return this.user.state === 'deleted'
  }
}
</script>

<style scoped>
</style>
