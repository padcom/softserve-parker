import dotenv from 'dotenv'
import envalid from 'envalid'

const { str, url, port } = envalid;

const envVariableValidators = {
  PORT: port({ default: 3000, desc: 'Port on which application is running'}),
  SMTP_PORT: port({ default: 2525, desc: 'Port on which emails will be tunneled to SMTP server.' }),
  SMTP_HOST: str({ default: 'localhost', desc: 'Hostname of SMTP server.' }),
  EMAIL: str({ default: 'ssparkertesting@gmail.com', desc: 'The e-mail account login for the e-mail sender in this project' }),
  CONFIRM_URL_BASE: url({ default: 'http://localhost:8080', desc: 'Url of application' }),
  SMTP_USER: str({ default: '', desc: 'User for smtp login'}),
  SMTP_PASSWORD: str({ default: '', desc: 'The password for the smtp login' }),
}

dotenv.config()

const env = envalid.cleanEnv(process.env, envVariableValidators, { strict: true })

export default env
