import { namespace } from 'vuex-class'
import { MutationTree, ActionTree } from 'vuex'
import { RootState } from './root-state'
import bus from '@/bus'
import logger from '@/logger'

export interface UIState {
  loading: boolean
}

const state: UIState = {
  loading: false
}

const mutations: MutationTree<UIState> = {
  setLoading (state, loading) {
    state.loading = loading
  }
}

const actions: ActionTree<UIState, RootState> = {
  startLoading () {
    this.commit('ui/setLoading', true)
  },
  stopLoading () {
    this.commit('ui/setLoading', false)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

export const UIState = namespace('ui').State
export const UIAction = namespace('ui').Action
