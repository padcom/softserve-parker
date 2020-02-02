import { register } from 'register-service-worker'

import logger from './logger'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      // https://goo.gl/AFskqB
      logger.info('App is being served from cache by a service worker.')
    },
    registered () {
      logger.info('Service worker has been registered.')
    },
    cached () {
      logger.info('Content has been cached for offline use.')
    },
    updatefound () {
      logger.info('New content is downloading.')
    },
    updated () {
      logger.info('New content is available; please refresh.')
    },
    offline () {
      logger.warn('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      logger.error('Error during service worker registration:', error)
    },
  })
}
