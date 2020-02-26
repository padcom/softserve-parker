import winston from 'winston'
import GelfTransport from 'winston-gelf'

import config from './config'

export const logger = winston.createLogger({
  format: winston.format.combine(winston.format.json()), // SoftServe logging system (Splunk) prefers JSON error format
  transports: [
    new winston.transports.File({
      filename: 'parker-error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'parker-general.log',
    }),
  ],
})

// For development - dump logs to console
if (config.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
}

if (config.GELF_HOST && config.GELF_PORT) {
  logger.info(`Starting GELF transport to ${config.GELF_HOST}:${config.GELF_PORT}`)
  logger.add(new GelfTransport({
    gelfPro: {
      fields: {
        env: config.NODE_ENV,
        facility: 'parker',
      },
      adapterName: 'udp',
      adapterOptions: {
        host: config.GELF_HOST,
        port: config.GELF_PORT,
      }
    }
  }))
}
