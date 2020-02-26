import dotenv from 'dotenv'
import envalid from 'envalid'

const { bool, str, url, port } = envalid;

const envVariableValidators = {
  NODE_ENV: str({ default: 'development', desc: 'Environment name' }),
  PORT: port({ default: 3000, desc: 'Port on which application is running'}),
  SMTP_PORT: port({ default: 2525, desc: 'Port on which emails will be tunneled to SMTP server.' }),
  SMTP_HOST: str({ default: 'localhost', desc: 'Hostname of SMTP server.' }),
  SMTP_SECURE: bool({ default: false, desc: 'Enable secure SMTP communication' }),
  EMAIL: str({ default: 'ssparkertesting@gmail.com', desc: 'The e-mail account login for the e-mail sender in this project' }),
  CONFIRM_URL_BASE: url({ default: 'http://localhost:8080', desc: 'Url of application' }),
  SMTP_USER: str({ default: '', desc: 'User for smtp login'}),
  SMTP_PASSWORD: str({ default: '', desc: 'The password for the smtp login' }),
  GELF_HOST: str({ default: '', desc: 'GELF host for logging' }),
  GELF_PORT: port({ default: 12201, desc: 'GELF port for logging' }),
  LOG_LEVEL: str({ default: 'info', desc: 'Log level' })
}

dotenv.config()

export default envalid.cleanEnv(process.env, envVariableValidators, { strict: true })
