import { Router } from 'express'
import { Authenticator } from './authenticate'

const router = Router()
const authenticator = new Authenticator()
router.use('/login', authenticator.authenticate)

export default router