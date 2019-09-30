import { namespace } from 'vuex-class'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import axios from 'axios'
import { RootState } from './root-state'
import { query } from '@/graphql'
import bus from '@/bus'
import logger from '@/logger'

export interface AuthState {
  user: any
  token: string | null
}

const state: AuthState = {
  user: null,
  token: null
}

const getters: GetterTree<AuthState, RootState> = {
  isLoggedIn: state => {
    return state.user !== null && state.token !== null
  }
}

const mutations: MutationTree<AuthState> = {
  setUser (state, user) {
    state.user = user
  },
  setToken (state, token) {
    state.token = token
    window.localStorage.setItem('token', token)
  }
}

const actions: ActionTree<AuthState, RootState> = {
  async login ({ commit }, { username, password }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data: token } = await axios.post('/login', {
          email: username,
          password
        })

        commit('setToken', token)

        const { user } = await query('query User($email: String!) { user(email: $email) { email } }', { email: username })
        commit('setUser', user)

        bus.emit('user-logged-in', user)
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
  logger.info(`User ${user.email} logged in`)
})

bus.on('user-login-error', error => {
  logger.error(error)
})

bus.on('user-logged-out', user => {
  logger.info(`User ${user.email} logged out`)
})
