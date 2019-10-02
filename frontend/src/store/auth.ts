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
  // @ts-ignore because JSON.parse(null) => null
  user: JSON.parse(window.localStorage.getItem('parker:user')),
  token: window.localStorage.getItem('parker:token')
}

const getters: GetterTree<AuthState, RootState> = {
  isLoggedIn: state => {
    return state.user !== null && state.token !== null
  }
}

const mutations: MutationTree<AuthState> = {
  setUser (state, user) {
    state.user = user
    if (!user) {
      window.localStorage.removeItem('parker:user')
    } else {
      window.localStorage.setItem('parker:user', JSON.stringify(user))
    }
  },
  setToken (state, token) {
    state.token = token
    if (!token) {
      window.localStorage.removeItem('parker:token')
    } else {
      window.localStorage.setItem('parker:token', token)
    }
  }
}

async function getUserByEmail (email: string, fields: string[] = [ 'email' ]) {
  const { user } = await query(`query
    User($email: String!) {
      user(email: $email) {
        ${fields.join('\n')}
      }
    }`, { email })

  return user
}

type Token = string

class API {
  async login (email: string, password: string): Promise<Token> {
    const { data: token } = await axios.post('/login', {
      email,
      password
    })

    return token
  }

  async logout (token: Token) {
    await axios.post('/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token} `
      }
    })
  }
}

const actions: ActionTree<AuthState, RootState> = {
  async login ({ commit }, { email, password }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await (new API().login(email, password))
        commit('setToken', token)

        const user = await getUserByEmail(email, [ 'email', 'rank', 'enabled' ])
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
    const token = state.token
    logger.debug('actions:auth/logout user', user, ', token', token)

    if (token) await (new API().logout(token))
    commit('setUser', null)
    commit('setToken', null)
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
