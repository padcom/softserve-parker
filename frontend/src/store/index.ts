import Vue from 'vue'
import Vuex from 'vuex'

import { RootState } from './root-state'
import auth from './auth'

Vue.use(Vuex)

export default new Vuex.Store<RootState>({
  modules: {
    auth
  }
})
