import { namespace } from 'vuex-class'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from './root-state'

export interface UIState {
  total: number
  pendingCalls: number
}

const state: UIState = {
  total: 0,
  pendingCalls: 0,
}

const getters: GetterTree<UIState, RootState> = {
  loading: state => {
    return state.pendingCalls > 0
  },
}

const mutations: MutationTree<UIState> = {
  beginRequest (state) {
    state.pendingCalls++
    state.total++
  },
  endRequest (state) {
    state.pendingCalls--
    if (state.pendingCalls === 0) {
      state.total = 0
    }
  },
}

const actions: ActionTree<UIState, RootState> = {
  beginRequest ({ commit }) {
    commit('beginRequest')
  },

  endRequest ({ commit }) {
    commit('endRequest')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export const UIState = namespace('ui').State
export const UIGetter = namespace('ui').Getter
export const UIAction = namespace('ui').Action
