import nodemailer from 'nodemailer'

export function mailer() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ssparkertesting@gmail.com',
      pass: 'Pas$7654321'
    }
  })
}