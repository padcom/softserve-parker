import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from './root-state'
import auth from './auth'
import ui from './ui'
import time from './time'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    auth,
    ui,
    time,
  },
})
