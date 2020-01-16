<template>
  <v-card>
    <v-card-title>
      <span class="headline">Edit user</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="user.firstName" label="First name" :error="!user.firstName" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="user.lastName" label="Last name" :error="!user.lastName" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="user.phone" type="string" label="Phone number" :error="!user.phone" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="user.plate" label="Plate number" :error="!user.plate" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-text-field v-model="user.roles" label="Role" :error="!user.roles" readonly v-on="on" />
              </template>
              <v-list>
                <v-list-item-group>
                <v-list-item v-for="role in [ 'user', 'admin', 'vip' ]" :key="role">
                  <v-list-item-title :key="role" @click="setRole(role)">{{ role }}</v-list-item-title>
                </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn text @click="$emit('close')">Cancel</v-btn>
      <v-btn color="blue darken-1" text @click="onSubmit">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'

@Component
export default class UserForm extends Vue {
  @Prop({ type: Object, required: true }) userProp: any

  @Watch('userProp')
  onUserChanged (value: object) {
    this.user = { ...value }
  }

  user = { ...this.userProp }

  setRole (role) {
    this.user.roles = role
  }

  onSubmit () {
    if (this.isFormFilledUp()) {
      const user = this.user
      this.$emit('onSubmit', user)
    }
  }

  isFormFilledUp (): boolean {
    return Boolean(
      this.user.firstName &&
      this.user.lastName &&
      this.user.plate &&
      this.user.phone
    )
  }
}
</script>
