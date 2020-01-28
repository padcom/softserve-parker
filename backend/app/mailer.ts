import nodemailer from 'nodemailer'
import env from './config'

const { SMTP_PORT, SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_SECURE } = env

//
// To start an SMTP server locally use the following command:
//
// $ python -m smtpd -nc DebuggingServer localhost:2525
//
// It will start an SMTP server that dumps each message to console for review.
// The default SMTP configuration assumes this server is running and is used for
// development purposes.
//

export function mailer () {
  const settings = {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Boolean(SMTP_SECURE),
    auth: undefined,
  }
  if (SMTP_HOST !== 'localhost' && SMTP_USER && SMTP_PASSWORD) {
    settings.auth = {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    }
  }

  return nodemailer.createTransport(settings)
}
