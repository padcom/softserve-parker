import axios from 'axios'
import bus from './bus'

axios.interceptors.request.use(
  config => {
    bus.emit('request-begin', { url: config.url })
    return config
  }
)

axios.interceptors.response.use(
  response => {
    bus.emit('request-end', { url: response.config.url })
    return response
  },
  error => {
    bus.emit('request-end', { error })
    return Promise.reject(error)
  }
)
