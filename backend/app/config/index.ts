import dotenv from 'dotenv'
import envalid from 'envalid'

console.error('NODE_ENV', process.env.NODE_ENV)
console.error( process.env)

const { str, url, port } = envalid;

const envVariableValidators = {
  PORT: port({ desc: 'Port on which application is running'}),
  SMTP_PORT: port({ desc: 'Port on which emails will be tunneled to SMTP server.' }),
  SMTP_HOST: str({ desc: 'Hostname of SMTP server.' }),
  EMAIL: str({ desc: 'The e-mail account login for the e-mail sender in this project' }),
  CONFIRM_URL_BASE: url({ desc: 'Url of application' }),
  SMTP_USER: str({ desc: 'User for smtp login'}),
  SMTP_PASSWORD: str({ desc: 'The password for the smtp login' })
}

dotenv.config()
const env = envalid.cleanEnv(process.env, envVariableValidators, { strict: true })
export default env