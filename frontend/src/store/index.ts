import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from './root-state'
import auth from './auth'
import ui from './ui'
import reservationRequests from './reservationRequests'

import bus from '../bus'

Vue.use(Vuex)

const store = new Vuex.Store<RootState>({
  modules: {
    auth,
    ui,
    reservationRequests,
  },
})

export default store

bus.on('clear-credentials', () => {
  store.dispatch('auth/clear')
})
