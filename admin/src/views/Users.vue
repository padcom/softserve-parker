<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Users
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-filter"
          label="Search"
          single-line
          hide-details
        />
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <UserForm
            :userProp="user"
            @onSubmit="onSubmit"
            @close="close"
          />
        </v-dialog>
      </v-card-title>
      <v-data-table class="elevation-1"
        :headers="headers"
        :items="drivers"
        :search="search"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:item.phone="{ item }">
          {{ getValue(item.phone) }}
        </template>
        <template v-slot:item.roles="{ item }">
          {{ getValue(item.roles) }}
        </template>
        <template v-slot:item.state="{ item }">
          {{ getValue(item.state) }}
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn x-small color="primary" @click="editItem(item)">
            edit
          </v-btn>
        </template>
        <template v-slot:item.remove="{ item }">
          <v-btn x-small color="error" @click="onRemoveItem(item)">
            remove
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <Information ref="info" />
  </v-container>
</template>

<script lang="ts">
import moment from 'moment'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { User, UserInterface } from '@/domain/User'
import Information from '@/components/Information.vue'
import UserForm from '@/components/forms/User.vue'

@Component({
  components: {
    Information,
    UserForm
  }
})
export default class Users extends Vue {
  headers = [
    { text: 'First Name', align: 'left', sortable: true, value: 'firstName' },
    { text: 'Last Name', align: 'left', sortable: true, value: 'lastName' },
    { text: 'Email', align: 'left', sortable: true, value: 'email' },
    { text: 'Phone number', align: 'left', sortable: true, value: 'phone' },
    { text: 'Plate number', align: 'left', sortable: true, value: 'plate' },
    { text: 'Role', align: 'left', value: 'roles' },
    { text: 'State', align: 'left', value: 'state' },
    { text: 'Ranking', align: 'left', value: 'rank' },
    { text: 'Actions', value: 'edit', sortable: false },
    { text: 'Remove', value: 'remove', sortable: false }
  ]

  drivers = []

  search = ''
  dialog = false
  user = {}

  mounted () {
    this.loadDrivers()
  }

  onSubmit (user: UserInterface) {
    this.dialog = false
    this.saveEditedUser(user)
  }

  editItem (item: UserInterface) {
    this.dialog = true
    this.user = Object.assign({}, item)
  }

  async onRemoveItem (user: UserInterface) {
    const agree = confirm(`Do you want to remove?`)
    if (agree) this.removeUser(user)
  }

  async loadDrivers () {
    try {
      const drivers = await User.getAll()
      this.drivers = drivers
    } catch (e) {
      this.drivers = []
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    }
  }

  async saveEditedUser (user: UserInterface) {
    try {
      const { firstName, lastName, plate, phone, id } = user
      const res = await User.updateUser(firstName, lastName, plate, phone, id)
      // @ts-ignore
      if (res) this.$refs.info.showInfo('User added')
      this.loadDrivers()
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    }
  }

  async removeUser (user: UserInterface) {
    try {
      const { id } = user
      const res = await User.removeUser(id)
      // @ts-ignore
      if (res) this.$refs.info.showInfo('User removed')
      this.loadDrivers()
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    }
  }

  close () {
    this.dialog = false
  }

  get date () {
    return moment(new Date()).format('YYYY-MM-DD')
  }

  getValue (data: string): string {
    return !data ? '-' : data
  }
}
</script>
