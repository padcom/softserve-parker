import { Response, Request, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import { logger } from '../logger'
import { UnauthenticatedError } from '../customErrors'
import { Session } from '../domain/Session'
import { User } from '../domain/User'
import { isTimeQuery } from '../graphql/utils'

export function getTokenFromRequest (req: Request): string {
  const authHeader: string = req.header('Authorization')
  if (!authHeader) throw new UnauthenticatedError('Token not provided')
  return authHeader.split(' ')[1]
}

function assertUserIsAuthorized (userToken: string, sessionToken: string): void | Error {
  const cert: string = fs.readFileSync(path.resolve(__dirname, '../../public.key'), 'utf8')
  if (!sessionToken || !jwt.verify(userToken, cert)) {
    throw new UnauthenticatedError('Unauthorized')
  }
}

async function assertUserIsActive (token: string) {
  const data = jwt.decode(token)
  // @ts-ignore
  const user = await User.byEmail(data.email)
  if (user.state !== 'active') {
    throw new UnauthenticatedError('Account is disabled or deleted')
  }
}

export async function isAuthorized (req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET') {
    // this is a quick fix to allow unauthorized access to graphql web client
    return next()
  }

  if (req.method === 'POST' && isTimeQuery(req.body.query)) {
    // allowing for date query to not be authorized
    return next()
  }

  try {
    const userToken: string = getTokenFromRequest(req)
    const token: string = await Session.fetchToken(userToken)
    assertUserIsAuthorized(userToken, token)
    await assertUserIsActive(token)
    next()
  } catch (e) {
    logger.error(e)
    res.status(e.status || 500).send(e.message)
  }
}
