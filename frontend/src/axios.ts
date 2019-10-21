import axios from 'axios'
import bus from './bus'
import logger from './logger'

axios.interceptors.request.use(
  config => {
    bus.emit('request-begin', { config })
    return config
  },
  error => {
    bus.emit('request-end', { error })
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    bus.emit('request-end', { response })
    return response
  },
  error => {
    bus.emit('request-end', { error })
    return Promise.reject(error)
  }
)

bus.on('request-begin', ({ config }) => {
  logger.debug('[HTTP] Request started', config.url)
})

bus.on('request-end', ({ error, response }) => {
  logger.debug('[HTTP] Request ended', response ? response.config.url : error)
})
