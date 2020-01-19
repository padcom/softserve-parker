import { Router } from 'express'

import env from '../config'
import { mailer } from '../mailer'
import { User } from '../domain/User'
import { SingleUseToken } from '../domain/SingleUseToken'

const router = Router()

router.post('/request-reset-link', async (req, res) => {
  const { EMAIL, CONFIRM_URL_BASE } = env
  try {
    const user = await User.byId(req.body.id)
    const token = await SingleUseToken.generate(user.email)
    const response = await mailer().sendMail({
      from: EMAIL,
      to: user.email,
      subject: 'Password reset',
      html: `
        <p>Click the following link to reset your password</p>
        <p>
          <a href="${CONFIRM_URL_BASE}/password/reset?token=${token}">Link</a>
        </p>
      `,
    })

    res.status(200).json({ status: 'OK - password reset email sent', response })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/reset', async (req, res) => {
  try {
    await SingleUseToken.byToken(req.query.token)
    res.redirect('/#/reset-password')
  } catch (e) {
    res.status(500).send(e.message)
  }
})

router.post('/reset', async (req, res) => {
  try {
    const token = await SingleUseToken.byToken(req.body.token)
    if (!req.body.password) {
      throw new Error('No password specified')
    }
    await SingleUseToken.invalidate(token.token)
    const user = await User.byEmail(token.email)
    await User.setPassword(user.id, req.body.password)
    res.redirect('/#/login')
  } catch (e) {
    res.status(500).send(e.message)
  }
})

export default router
