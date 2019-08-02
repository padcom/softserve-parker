/* eslint-disable no-console */

class Logger {
  debug (...args: any[]) {
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
      console.log(...args)
    }
  }
  info (...args: any[]) {
    console.log(...args)
  }
  warn (...args: any[]) {
    console.warn(...args)
  }
  error (...args: any[]) {
    console.error(...args)
  }
}

export default new Logger()
