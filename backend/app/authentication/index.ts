import { Router, Response, Request, NextFunction } from 'express'
import { Authenticator } from './authenticate'

const router = Router()
const authenticator = new Authenticator()
router.use('/login', validateParams, authenticator.authenticate)

function validateParams(req: Request, res: Response, next: NextFunction) {
    if (!req.body.username || !req.body.password) res.status(403).send()
    return next()
}

export default router