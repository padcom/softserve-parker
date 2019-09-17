import winston from 'winston'

const { NODE_ENV } = process.env

export const logger = winston.createLogger({
  format: winston.format.combine(winston.format.json()), // SoftServe logging system (Splunk) prefers JSON error format
  transports: [
    new winston.transports.File({
      filename: 'parker-error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'parker-general.log'
    }),
  ],
})

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
