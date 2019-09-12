import mysql from 'mysql2'
import { logger } from './logger'

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} = process.env

const pool = mysql.createPool({
  connectionLimit: 10,
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: (MYSQL_PORT as unknown) as number,
})

export const db = pool.promise()

// Test for common db connection errors then quit
pool.getConnection((err, connection): void => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      logger.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      logger.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      logger.error('Database connection was refused.')
    }
  }
  if (connection) {
    connection.release()
  }
  return
})
