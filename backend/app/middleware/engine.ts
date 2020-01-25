import { Router } from 'express'

import { engine } from '../engine'
import { SingleUseToken } from '../domain/SingleUseToken'

const router = Router()

router.post('/start', async (req, res) => {
  try {
    const token = await SingleUseToken.byToken(req.body.token)
    await SingleUseToken.invalidate(token.token)
    await engine()
    res.status(200).send('Engine executed')
  } catch (e) {
    res.status(500).send(e.message)
  }
})
