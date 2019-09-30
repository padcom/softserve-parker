import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from './root-state'
import auth from './auth'
import dates from './dates'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    auth,
    dates
  }
})
