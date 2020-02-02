import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { namespace } from 'vuex-class'
import { ReservationRequest, ReservationRequestAPI } from '@/domain/ReservationRequest'
import { RootState } from './root-state'

export interface RequestState {
  requests: ReservationRequest[]
  abandonedRequests: ReservationRequest[]
  abandonedRequestsRefresherTimer: number | null
}

const state: RequestState = {
  requests: [],
  abandonedRequests: [],
  abandonedRequestsRefresherTimer: null,
}

function getRequestByDate (requests: ReservationRequest[], date: string) {
  return requests.find(request => request.date === date)
}

function isAlreadyRequested (requests: ReservationRequest[], date: string) {
  return Boolean(getRequestByDate(requests, date))
}

function createRequestForDate (userId: number, date: string) {
  return ReservationRequestAPI.createRequest(userId, [ date ])
}

const getters: GetterTree<RequestState, RootState> = {
  pendingRequests: (state) => {
    return state.requests.filter(request => request.status !== 'cancelled')
  },

  todayRequest: (state, getters, rootState) => {
    return state.requests.find(request => request.date === rootState.time.today && [ 'won', 'lost' ].includes(request.status))
  },

  firstAbandonedRequest (state) {
    return state.abandonedRequests[0] || null
  },

  hasLostRequest (state, getters, rootState) {
    const request = getRequestByDate(state.requests, rootState.time.today)
    return request && [ 'won', 'lost' ].includes(request.status)
  },
}

const mutations: MutationTree<RequestState> = {
  setRequests (state, requests) {
    state.requests = requests
  },
  setAbandonedRequests (state, abandonedRequests) {
    state.abandonedRequests = abandonedRequests
  },
  setAbandonedRequestsRefreshTimer (state, timer) {
    state.abandonedRequestsRefresherTimer = timer
  },
  setRequestStatus (state, { request, status }: { request: ReservationRequest, status: string }) {
    request.status = status
  },
}

const actions: ActionTree<RequestState, RootState> = {
  async loadRequests ({ commit, rootState }) {
    if (rootState.auth.user && rootState.auth.user.id) {
      commit('setRequests', [])
      const requests = await ReservationRequestAPI.fetchByUserId(rootState.auth.user.id, rootState.time.today)
      commit('setRequests', requests)
    }
  },
  async loadAbandonedRequests ({ commit, rootState }) {
    commit('setAbandonedRequests', [])
    if (rootState.auth.user && rootState.auth.user.id) {
      const abandonedRequests = await ReservationRequestAPI.abandonedRequests(rootState.time.today, rootState.auth.user.id)
      commit('setAbandonedRequests', abandonedRequests)
    }
  },
  startRefresherAbandonedRequests ({ state, dispatch, commit }) {
    if (state.abandonedRequestsRefresherTimer === null) {
      const timer = setInterval(() => { dispatch('loadAbandonedRequests') }, 10000)
      commit('setAbandonedRequestsRefreshTimer', timer)
    }
  },
  stopRefresherAbandonedRequests ({ state, commit }) {
    if (state.abandonedRequestsRefresherTimer !== null) {
      clearInterval(state.abandonedRequestsRefresherTimer)
      commit('setAbandonedRequestsRefreshTimer', null)
    }
  },

  async createReservationRequests ({ state, rootState }, dates) {
    return Promise.all(
      dates
        .filter((date: string) => !isAlreadyRequested(state.requests, date))
        .map(async (date: string) => createRequestForDate(rootState.auth.user.id, date))
    )
  },

  async updateRequestStatus ({ commit }, { request, status }: { request: ReservationRequest, status: string }) {
    await ReservationRequestAPI.setRequestStatus(request.id, status)
    commit('setRequestStatus', { request, status })
  },

  async cancelRequest ({ dispatch }, request) {
    await dispatch('updateRequestStatus', { request, status: 'cancelled' })
  },

  async abandonRequest ({ dispatch }, request) {
    await dispatch('updateRequestStatus', { request, status: 'abandoned' })
  },

  async takeLastMinuteRequest ({ getters, commit }, request) {
    if (getters.todayRequest && getters.todayRequest.status === 'lost') {
      const result = await ReservationRequestAPI.takeLastMinuteSpot(request, getters.todayRequest)
      if (result) {
        commit('setRequestStatus', { request, status: 'cancelled' })
        commit('setRequestStatus', { request: getters.todayRequest, status: 'won' })
      }
      return result
    } else {
      return false
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export const RequestState = namespace('request').State
export const RequestGetter = namespace('request').Getter
export const RequestAction = namespace('request').Action
