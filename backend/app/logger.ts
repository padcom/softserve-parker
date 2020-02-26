import winston from 'winston'
import GelfTransport from 'winston-gelf'

import config from './config'

export const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: config.LOG_LEVEL,
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

// ----------------------------------------------------------------------------
// Extending the Winston logger with JSON logging capability
// ----------------------------------------------------------------------------

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

declare module 'winston' {
  interface Logger {
    json(level: LogLevel, data: object): void
  }
}

logger.json = (level: LogLevel, data: object) => {
  logger.log({ level, message: `JSON: ${JSON.stringify(data)}` })
}

// ----------------------------------------------------------------------------
// For development - dump logs to console
// ----------------------------------------------------------------------------
if (config.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
}

// ----------------------------------------------------------------------------
// For production - send data to GELF-enabled log aggregator
// ----------------------------------------------------------------------------
if (config.GELF_HOST && config.GELF_PORT) {
  logger.info(`Starting GELF transport to ${config.GELF_HOST}:${config.GELF_PORT}`)

  function convertJsonMessageToString (message: any) {
    if (message.short_message.startsWith('JSON: ')) {
      try {
        const data = JSON.parse(message.short_message.substring(6))
        Object.keys(data).forEach(field => { message[field] = data[field] })
        message.short_message = 'Parsed - see fields'
      } catch {}
    }

    return message
  }

  const transport = new GelfTransport({
    gelfPro: {
      fields: {
        env: config.NODE_ENV,
        facility: 'parker',
      },
      adapterName: 'udp',
      adapterOptions: {
        host: config.GELF_HOST,
        port: config.GELF_PORT,
      },
      transform: [
        convertJsonMessageToString
      ]
    }
  })
  logger.add(transport)
}
