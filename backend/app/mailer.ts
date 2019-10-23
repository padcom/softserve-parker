import nodemailer from 'nodemailer'

export function mailer() {
  return nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e7a1a548c2b5fa",
      pass: "375ad49c0a886c"
    }
  })
}