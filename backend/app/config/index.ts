import dotenv from 'dotenv'
import envalid from 'envalid'

console.error('NODE_ENV', process.env.NODE_ENV)
console.error( process.env)

const { str, url, port } = envalid;

const envVariableValidators = {
  PORT: port({ default: 3000, desc: 'Port on which application is running'}),
  SMTP_PORT: port({ default: 2525, desc: 'Port on which emails will be tunneled to SMTP server.' }),
  SMTP_HOST: str({ default: 'smtp.mailtrap.io', desc: 'Hostname of SMTP server.' }),
  EMAIL: str({ default: 'ssparkertesting@gmail.com', desc: 'The e-mail account login for the e-mail sender in this project' }),
  CONFIRM_URL_BASE: url({ default: 'http://localhost:8080', desc: 'Url of application' }),
  SMTP_USER: str({ default: 'e7a1a548c2b5fa', desc: 'User for smtp login'}),
  SMTP_PASSWORD: str({ default: '375ad49c0a886c', desc: 'The password for the smtp login' })
}

dotenv.config()

const env = envalid.cleanEnv(process.env, envVariableValidators, { strict: true })
export default env
