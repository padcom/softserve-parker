import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from './root-state'
import auth from './auth'
import ui from './ui'

import bus from '../bus'

Vue.use(Vuex)

const store = new Vuex.Store<RootState>({
  modules: {
    auth,
    ui,
  },
})

export default store

bus.on('clear-credentials', () => {
  store.dispatch('auth/clear')
})
