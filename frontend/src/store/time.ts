import { namespace } from 'vuex-class'
import { MutationTree, ActionTree } from 'vuex'
import { RootState } from './root-state'
import bus from '@/bus'
import logger from '@/logger'
import { query } from '@/graphql'

import addDays from 'common/date/addDays'

interface TimeResponse {
  today: string
  deadline: string
  cancelHour: string
}

class API {
  static async time () {
    const { today, deadline, cancelHour } = await query<TimeResponse>('query { today, deadline, cancelHour }')
    return { today, deadline, cancelHour }
  }
}

export interface TimeState {
  today: string
  yesterday: string
  tomorrow: string
  deadline: string // HH:mm
  cancelHour: string // HH:mm
}

const state: TimeState = {
  today: '',
  tomorrow: '',
  yesterday: '',
  deadline: '',
  cancelHour: '07:00',
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
  setCancelHour (state, hour: string) {
    if (state.cancelHour !== hour) {
      state.cancelHour = hour
    }
  },
}

const actions: ActionTree<TimeState, RootState> = {
  async update ({ commit }): Promise<void> {
    const time = await API.time()
    commit('setDate', time.today)
    commit('setDeadlineHour', time.deadline)
    commit('setCancelHour', time.cancelHour)
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
