import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import baibulo from 'baibulo'
import 'reflect-metadata' // required for typegraphql
import { graphql } from './graphql'
import authentication from './authentication';
import { logger } from './logger'
import { isAuthorized } from './middleware/authorization'

const { NODE_ENV, PORT = 3000 } = process.env

async function main () {
  const app = express()
  app.use(helmet())
  app.use(cookieParser())
  app.use(cors())
  app.use(express.json())

  app.use(authentication);

  const server = await graphql
  app.use('/graphql', isAuthorized, server.getMiddleware({ path: '/' }))
  app.use(baibulo({ root: '/tmp/parker-frontend', download: true, upload: false }))

  try {
    app.listen(PORT, () => {
      logger.info(`Success! Parker backend started in ${NODE_ENV.toUpperCase()} mode at http://127.0.0.1:${PORT}${server.graphqlPath }`)
    })
  } catch (e) {
    logger.error(`Error! Failed to start Apollo server. Error message: ${e}`)
  }
  
  // second server just for uploading new versions of frontend, on separate port to guard it from using it from outside world
  const deployment = express()
  deployment.use(cookieParser())
  deployment.use(baibulo({ root: '/tmp/parker-frontend', download: false, upload: true }))
  const deploymentPort = typeof(PORT) === 'string' ? parseInt(PORT) + 1 : PORT + 1
  deployment.listen(deploymentPort, () => { logger.info(`Frontend deployment server running on port ${deploymentPort}`) })
}

main()
