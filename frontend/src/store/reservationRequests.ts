import { namespace } from 'vuex-class'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { RootState } from './root-state'
import bus from '@/bus'
import logger from '@/logger'
import { ReservationRequest } from '@/domain/ReservationRequest'

export interface ReservationRequestsState {
  requests: {
    date: Date
    to: Date
    status: string
  }[]
}

const state: ReservationRequestsState = {
  requests: []
}

const mutations: MutationTree<ReservationRequestsState> = {
  setRequests (state, requests) {
    state.requests = requests
  }
}

const actions: ActionTree<ReservationRequestsState, RootState> = {
  async getOwnRequests ({ commit, rootState }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const reservationRequests = await ReservationRequest.fetchByUserId(
          rootState.auth.user.id
        )
        commit('setRequests', reservationRequests)

        bus.emit('reservation-requests-fetched', reservationRequests)
        resolve(reservationRequests)
      } catch (error) {
        bus.emit('reservation-requests-error', error)
        reject(error)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

export const ReservationRequestsState = namespace('reservationRequests').State
export const ReservationRequestsAction = namespace('reservationRequests').Action

bus.on('reservation-requests-fetched', requests => {
  logger.info(`Fetched ${requests.length} user requests`)
})

bus.on('reservation-requests-error', error => {
  logger.error(error)
})
