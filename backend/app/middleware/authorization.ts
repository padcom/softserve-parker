import { Response, Request, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path'
import jwt from 'jsonwebtoken';
import { fetchSessionToken } from '../utilities/sessions'
import { logger } from '../logger'
import { UnauthenticatedError } from '../customErrors'

export async function isAuthorized(req: Request, res: Response, next: NextFunction) {
  try {
    const userToken: string = getTokenFromRequest(req)
    const token: string = await fetchSessionToken(userToken)
    assertUserIsAuthorized(userToken, token)
  } catch (e) {
    logger.error(e)
    res.status(e.status || 500).send(e.message)
  }
  return next()
}

function getTokenFromRequest(req: Request): string {
  const authHeader: string = req.header('Authorization')
  if (!authHeader) throw new UnauthenticatedError('Token not provided')
  return authHeader.split(' ')[1]
}

function assertUserIsAuthorized(userToken: string, sessionToken: string): void | Error {
  const cert: string = fs.readFileSync(path.resolve(__dirname, '../../public.key'), 'utf8')
  if (!sessionToken || !jwt.verify(userToken, cert)) throw new UnauthenticatedError('Unauthorized')
}