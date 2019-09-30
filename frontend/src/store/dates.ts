import { namespace } from 'vuex-class'

export interface DatesState {
  dates: {
    from: Date
    to: Date
    status: string
  }[]
}

const state: DatesState = {
  dates: [
    {
      from: new Date(),
      to: new Date(),
      status: 'resolved'
    },
    {
      from: new Date(),
      to: new Date(),
      status: 'resolved'
    }
  ]
}

export default {
  namespaced: true,
  state
}

export const DatesState = namespace('dates').State
