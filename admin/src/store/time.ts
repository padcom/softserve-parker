import { namespace } from 'vuex-class'
import { MutationTree, ActionTree } from 'vuex'
import { RootState } from './root-state'
import bus from '@/bus'
import logger from '@/logger'
import { query } from '@/graphql'

import addDays from 'common/date/addDays'

interface TimeResponse {
  today: String
  deadline: String
}

class API {
  static async time () {
    const { today, deadline } = await query<TimeResponse>('query { today, deadline }')
    return { today, deadline }
  }
}

export interface TimeState {
  today: string
  yesterday: string
  tomorrow: string
  deadline: string // HH:mm
}

const state: TimeState = {
  today: '',
  tomorrow: '',
  yesterday: '',
  deadline: '',
}

const mutations: MutationTree<TimeState> = {
  setDate (state, date: string) {
    if (state.today !== date) {
      state.today = date
      state.yesterday = addDays(state.today, -1)
      state.tomorrow = addDays(state.today, 1)

      bus.emit('time-updated', date)
    }
  },
  setDeadlineHour (state, deadline: string) {
    if (state.deadline !== deadline) {
      state.deadline = deadline
    }
  },
}

const actions: ActionTree<TimeState, RootState> = {
  async update ({ commit, state }): Promise<void> {
    const time = await API.time()
    commit('setDate', time.today)
    commit('setDeadlineHour', time.deadline)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}

export const TimeState = namespace('time').State
export const TimeAction = namespace('time').Action

bus.on('time-updated', (date: string) => {
  logger.info(`Date updated:`, date)
})
