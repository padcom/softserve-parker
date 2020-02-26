import './polyfills'
import './config'

import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { wrap } from 'async-middleware'
import 'reflect-metadata' // required for typegraphql
import { graphql } from './graphql'
import { logger } from './logger'
import { isAuthorized } from './middleware/authorization'
import { login, logout, signUp, confirmSignUp } from './middleware/authenticate'
import passwordReset from './middleware/passwordReset'
import logging from './middleware/logging'

import { CronJob } from 'cron'
import { task } from './engine'

const { NODE_ENV, PORT = 3000 } = process.env

async function main () {
  const app = express()
  app.use(helmet())
  app.use(cookieParser())
  app.use(cors())
  app.use(express.json())

  app.use('/login', logging, wrap(login))
  app.use('/logout', logging, wrap(logout))
  app.use('/signup', logging, wrap(signUp))
  app.use('/confirm-registration', logging, wrap(confirmSignUp))
  app.use('/password', logging, wrap(passwordReset))

  const server = await graphql
  // @ts-ignore
  app.use('/graphql', logging, isAuthorized, wrap(server.getMiddleware({ path: '/' })))

  app.use(express.static('public'))

  try {
    app.listen(PORT, () => {
      // @ts-ignore
      logger.info(`Success! Parker backend started in ${NODE_ENV.toUpperCase()} mode at http://127.0.0.1:${PORT}${server.graphqlPath }`)
    })
  } catch (e) {
    logger.error(`Error! Failed to start Apollo server. Error message: ${e}`)
  }

  // // start cron that will run every minute and recalculate parking spaces
  new CronJob('0 * * * * *', task, null, true, 'Europe/Warsaw')
}

main()
