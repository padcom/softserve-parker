const state = {
  user: null
}

const getters = {
  isLoggedIn = state => state.user !== null
}

const mutations = {
  setUser (state, user) {
    state.user = user
  }
}

const actions = {
  login ({ commit }, username, password) {
    commit('setUser', { name: username })
  },

  logout ({ commit }) {
    commit('setUser', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
