import { Response, Request, NextFunction } from 'express';
import { FieldPacket, RowDataPacket } from 'mysql'
import * as fs from 'fs';
import * as path from 'path'
import jwt from 'jsonwebtoken';
import { db } from '../db'
import { Session } from '../graphql/sessions/typedefs'
import { logger } from '../logger'
import { UnauthenticatedError } from '../customErrors'

export async function isAuthorized(req: Request, res: Response, next: NextFunction) {
  try {
    const token: string = getTokenFromRequest(req)
    const session: Session = await fetchSessionToken(token)
    assertUserIsAuthorized(token, session.token)
  } catch (e) {
    logger.error(e)
    return res.status(e.status || 500).send()
  }
  return next()
}

function getTokenFromRequest(req: Request): string {
  const authHeader: string | undefined = req.get('Authorization')
  if (!authHeader) throw new UnauthenticatedError('Token not provided')
  return authHeader.split(' ')[1]
}

async function fetchSessionToken(token: string): Promise<Session> {
  const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
    `
    SELECT *
    FROM sessions
    WHERE token = ?
    `,
    [token]
  )
  assertSessionIsFound(rows[0])
  return rows[0] as Session
}

function assertSessionIsFound(session: RowDataPacket): void | UnauthenticatedError {
  if (!session) throw new UnauthenticatedError(`Session doesn't exist.`)
}

function assertUserIsAuthorized(userToken: string, sessionToken: string): void | Error {
  const cert: string = fs.readFileSync(path.resolve(__dirname, '../../public.key'), 'utf8')
  if (!sessionToken || !jwt.verify(userToken, cert)) throw new UnauthenticatedError('Unauthorized')
}