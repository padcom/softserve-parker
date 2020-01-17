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
        <v-spacer />
        <v-btn @click="createNewUserDialog">
          Add user
        </v-btn>
        <v-dialog
          v-model="newUserDialog"
          max-width="500px"
        >
          <CreateUserForm
            :userProp="user"
            @onSubmit="createNewUser"
            @close="newUserDialog = false"
          />
        </v-dialog>
      </v-card-title>
      <v-data-table class="elevation-1"
        :headers="headers"
        :items="drivers"
        :search="search"
        :loading="loading"
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
          <v-tooltip bottom v-if="item.description">
            <template v-slot:activator="{ on }">
              <span v-on="on" style="cursor: help; font-weight: bold;">{{ getValue(item.state) }}</span>
            </template>
            <span>{{ item.description }}</span>
          </v-tooltip>
          <span v-else>{{ getValue(item.state) }}</span>
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
import CreateUserForm from '@/components/forms/CreateUser.vue'

@Component({
  components: {
    Information,
    UserForm,
    CreateUserForm,
  },
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
    { text: 'Remove', value: 'remove', sortable: false },
  ]

  drivers = [] as UserInterface[]

  search = ''
  dialog = false
  newUserDialog = false
  user = {}
  loading = false

  mounted () {
    this.loadDrivers()
  }

  onSubmit (user: UserInterface) {
    this.dialog = false
    this.saveEditedUser(user)
  }

  editItem (item: UserInterface) {
    this.user = item
    this.dialog = true
  }

  async onRemoveItem (user: UserInterface) {
    const agree = confirm(`Do you want to remove?`)
    if (agree) this.removeUser(user)
  }

  async loadDrivers () {
    this.loading = true
    try {
      const drivers = await User.getAll()
      this.drivers = drivers.map(driver => ({
        ...driver,
        rank: driver.rank !== -1 ? driver.rank : '',
      }))
    } catch (e) {
      this.drivers = []
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    } finally {
      this.loading = false
    }
  }

  async saveEditedUser (user: UserInterface) {
    try {
      const { state, firstName, lastName, plate, phone, id, roles, description } = user
      const res = await User.updateUser(state, firstName, lastName, plate, phone, id, roles, description)
      if (res) {
        await this.loadDrivers()
        // @ts-ignore
        this.$refs.info.showInfo('User updated')
      } else {
        throw new Error(res)
      }
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

  createNewUserDialog () {
    this.user = { state: 'active', roles: 'user' }
    this.newUserDialog = true
  }

  async createNewUser (user: UserInterface) {
    this.newUserDialog = false
    try {
      const { email, password, state, firstName, lastName, plate, phone, roles, description } = user
      const res = await User.createUser(email, password, state, firstName, lastName, plate, phone, roles, description)
      if (res) {
        await this.loadDrivers()
        // @ts-ignore
        this.$refs.info.showInfo('User created')
      } else {
        throw new Error(res)
      }
    } catch (e) {
      // @ts-ignore
      this.$refs.info.showError(e.message as string)
    }
  }
}
</script>
