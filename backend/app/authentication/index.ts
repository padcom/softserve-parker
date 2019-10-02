import { Router } from 'express'
import { Authenticator } from './authenticate'

const router = Router()
const authenticator = new Authenticator()
router.use('/login', authenticator.authenticate)
router.use('/logout', authenticator.logout)

export default router
