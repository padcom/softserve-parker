import { v4 as uuid } from 'uuid'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { logger } from '../logger'
import { getTokenFromRequest } from '../middleware/authorization'
import { isTimeQuery } from '../graphql/utils'

function convertDataToString (data: any): string {
  return Object.keys(data)
    .filter(field => data[field])
    .map(field => `${field}: ${data[field]}`)
    .join('\n')
}

function filterFields (data: any, ...fields): any {
  return Object.keys(data)
    .filter(field => !fields.includes(field))
    .reduce((result, field) => ({ ...result, [field]: data[field] }), {})
}

function getRequestBasics (req: Request) {
  return {
    phase: 'request',
    url: req.url,
    method: req.method,
  }
}

function isGraphQLRequest (req: Request): boolean {
  return req.method === 'POST' && req.body.query
}

function getGraphQLData (req: Request) {
  const result: any = {}

  if (isGraphQLRequest(req)) {
    result.gqlQuery = req.body.query
    if (req.body.variables) {
      result.gqlVars = convertDataToString(req.body.variables)
    }
  }

  return result
}

function getRequestBody (req: Request) {
  if (!isGraphQLRequest(req) && req.body) {
    return filterFields(req.body, 'password')
  } else {
    return {}
  }
}

function hasTokenInRequest (req: Request) {
  return Boolean(req.header('Authorization'))
}

function getUserInfo (req: Request) {
  try {
    if (hasTokenInRequest(req)) {
      const userToken = getTokenFromRequest(req)
      const tokenData: any = jwt.decode(userToken)
      return {
        authorized: true,
        userId: tokenData.userID,
        email: tokenData.email,
      }
    } else {
      return { authorized: false }
    }
  } catch {
    return { authorized: false }
  }
}

function shouldSkipLogging(req: Request): boolean {
  // There's no need to log time queries...
  return req.method === 'POST' && isTimeQuery(req.body.query)
}

export default function requestResponseLogger(req: Request, res: Response, next: NextFunction) {
  if (shouldSkipLogging(req)) {
    next()
    return
  }

  const uid = uuid()
  req.headers['uid'] = uid

  try {
    const request: any = {
      uid,
      ...getRequestBasics(req),
      ...getGraphQLData(req),
      ...getRequestBody(req),
      ...getUserInfo(req),
    }
    logger.json('debug', request)
  } catch (e) {
    logger.error(e)
  }

  next()

  try {
    const response = {
      uid,
      phase: 'response',
      status: res.statusCode,
      message: res.statusMessage,
    }

    logger.json('debug', response)
  } catch (e) {
    logger.error(e)
  }
}
