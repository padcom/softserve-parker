import nodemailer from 'nodemailer'
import env from './config'

const { SMTP_PORT, SMTP_HOST, SMTP_USER, SMTP_PASSWORD } = env

export function mailer () {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  })
}
