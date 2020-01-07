import winston from 'winston'

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

// Docker will be running the processes and it needs console logs to do logging
logger.add(new winston.transports.Console({
  format: winston.format.simple()
}))
