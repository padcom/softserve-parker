import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from './root-state'
import auth from './auth'
import ui from './ui'
import reservationRequests from './reservationRequests'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    auth,
    ui,
    reservationRequests
  }
})
