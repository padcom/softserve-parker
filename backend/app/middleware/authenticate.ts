import { Response, Request } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { logger } from '../logger'
import { UnauthenticatedError } from '../customErrors'
import { User } from '../domain/User'
import { Session } from '../domain/Session'

const cert = fs.readFileSync(path.resolve(__dirname, '../../private.key'), 'utf8')

function validateParams (req: Request): void | UnauthenticatedError {
  if (!req.body || !req.body.email || !req.body.password) throw new UnauthenticatedError('Credentials not provided.')
}

async function assertPasswordsMatching (password: string, hash: string): Promise<void | UnauthenticatedError> {
  const match: boolean = await bcrypt.compare(password, hash)
  if (!match) throw new UnauthenticatedError('Incorrect password.')
}

async function getJSONToken (userID: number, email: string): Promise<string> {
  return jwt.sign({ userID, email }, cert, { algorithm: 'RS256' });
}

function getTokenFromRequest (req: Request): string {
  const header = req.header('Authorization')
  if (!header) throw new UnauthenticatedError('User not logged in')

  return header.split(' ')[1]
}

function getErrorStatus (e: Error): number {
  if (e instanceof UnauthenticatedError || e.message === `User doesn't exist.`) {
    return 403
  } else {
    return 500
  }
}

/**
 * Filter messages like "incorrect password" and "User doesn't exist" and return secure message to frontend
 * @param {Error} e
 * @returns {string}
 */
function getErrorMessage (e: Error): string {
  if (e.message === `User doesn't exist.` || e.message === `Incorrect password.`) {
    return "Incorrect email or password."
  } else {
    return e.message
  }
}

export async function login (req: Request, res: Response) {
  try {
    validateParams(req);
    const user = await User.byEmail(req.body.email)
    await assertPasswordsMatching(req.body.password, user.password)
    const token = await getJSONToken(user.id, user.email)
    await Session.create(token)
    res.end(token)
  } catch (e) {
    logger.error(e)
    const status = getErrorStatus(e)
    res.status(status).end(getErrorMessage(e))
  }
}

export async function signUp (req: Request, res: Response) {
  try {
    const { firstName, lastName, email, plate, phone, password } = req.body
    await User.validateUserCreation(email)
    const result = await User.create(email, password, firstName, lastName, plate, phone, 'user', 'inactive')
    res.send({data: { userId: result }})
  } catch (e) {
    logger.error(e)
    const status = getErrorStatus(e)
    res.status(status).end(e.message)
  }
}

export async function confirmSignUp (req: Request, res: Response) {
  try {
    const { userId } = req.body
    await User.byId(userId)
    await User.setEnabled(userId, true)
    res.status(200).end('OK')
  } catch (e) {
    logger.error(e)
    const status = getErrorStatus(e)
    res.status(status).end(e.message)
  }
}

export async function logout (req: Request, res: Response) {
  try {
    await Session.delete(getTokenFromRequest(req))
    res.status(200).end('User logged out successfuly')
  } catch (e) {
    logger.error(e)
    const status = getErrorStatus(e)
    res.status(status).end(e.message)
  }
}
