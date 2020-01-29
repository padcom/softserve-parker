import axios from 'axios'
import bus from './bus'
import logger from './logger'

function isTimeRefreshQuery (query?: string): boolean {
  return query !== undefined && query.includes('{ today, deadline }')
}

axios.interceptors.request.use(
  config => {
    if (!isTimeRefreshQuery(config.data.query)) {
      bus.emit('request-begin', { config })
    }
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
