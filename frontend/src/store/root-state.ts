import { AuthState } from './auth'
import { TimeState } from './time'
import { UIState } from './ui'

export interface RootState {
  ui: UIState,
  auth: AuthState,
  time: TimeState,
}
