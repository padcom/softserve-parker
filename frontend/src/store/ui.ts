import { namespace } from 'vuex-class'
import { MutationTree, ActionTree, GetterTree } from 'vuex'
import { RootState } from './root-state'

export interface UIState {
  loadingCount: number
}

const state: UIState = {
  loadingCount: 0,
}

const getters: GetterTree<UIState, RootState> = {
  loading: state => state.loadingCount > 0,
}

const mutations: MutationTree<UIState> = {
  startLoading (state) {
    state.loadingCount++
  },
  stopLoading (state) {
    if (state.loadingCount > 0) {
      state.loadingCount--
    }
  },
}

const actions: ActionTree<UIState, RootState> = {
  startLoading () {
    this.commit('ui/startLoading')
  },
  stopLoading () {
    this.commit('ui/stopLoading')
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
