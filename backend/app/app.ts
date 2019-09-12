import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import 'reflect-metadata' // required for typegraphql
import { apolloServer } from './utils/apolloServer'
import { logger } from './utils/logger'

const { NODE_ENV, PORT } = process.env
;(async function() {
  const app = express()
  app.use(helmet())
  app.use(cors())

  const server = await apolloServer
  server.applyMiddleware({
    app,
    path: '/',
  })


  try {
    app.listen(PORT, () => {
      logger.info(
        `🚀 Success! Parker backend started in ${NODE_ENV.toUpperCase()} mode at http://127.0.0.1:${PORT}${
          server.graphqlPath
        }`
      )
    })
  } catch (e) {
    logger.error(`Error! Failed to start Apollo server. Error message: ${e}`)
  }
})()
