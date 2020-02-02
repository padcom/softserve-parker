import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from './root-state'
import auth from './auth'
import ui from './ui'
import time from './time'
import request from './requests'

import bus from '../bus'

Vue.use(Vuex)

const store = new Vuex.Store<RootState>({
  modules: {
    auth,
    ui,
    time,
    request,
  },
})

export default store

bus.on('clear-credentials', () => {
  store.dispatch('auth/clear')
})
