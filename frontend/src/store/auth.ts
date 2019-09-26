import { namespace } from 'vuex-class'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import axios from 'axios'
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
    return new Promise(async (resolve, reject) => {
      const user = { name: username }

      try {
        const { data } = await axios.post('http://localhost:3000/login', {
          username,
          password
        })

        window.localStorage.setItem('token', data)
        bus.emit('user-logged-in', user)
        commit('setUser', user)
        resolve(user)
      } catch (error) {
        bus.emit('user-login-error', error)
        reject(error)
      }
    })
  },

  async logout ({ commit, state }): Promise<void> {
    const user = state.user
    window.localStorage.removeItem('token')
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

bus.on('user-login-error', error => {
  logger.error(error)
})

bus.on('user-logged-out', user => {
  logger.info(`User ${user.name} logged out`)
})
