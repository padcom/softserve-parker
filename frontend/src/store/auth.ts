import { namespace } from 'vuex-class'
import { GetterTree, MutationTree, ActionTree } from 'vuex'

import { RootState } from './root-state'

import bus from '@/bus'
import logger from '@/logger'

export interface AuthState {
  user: any
}

const state: AuthState = {
  user: null
}

const getters: GetterTree<AuthState, RootState> = {
  isLoggedIn: state => {
    return state.user !== null
  }
}

const mutations: MutationTree<AuthState> = {
  setUser (state, user) {
    state.user = user
  }
}

const actions: ActionTree<AuthState, RootState> = {
  async login ({ commit }, { username, password }): Promise<any> {
    const user = { name: username }
    commit('setUser', user)
    bus.emit('user-logged-in', user)
  },

  async logout ({ commit, state }): Promise<void> {
    const user = state.user
    commit('setUser', null)
    bus.emit('user-logged-out', user)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export const AuthState = namespace('auth').State
export const AuthGetter = namespace('auth').Getter
export const AuthAction = namespace('auth').Action

bus.on('user-logged-in', user => {
  logger.info(`User ${user.name} logged in`)
})

bus.on('user-logged-out', user => {
  logger.info(`User ${user.name} logged out`)
})
