import dotenv from 'dotenv';
import mysql from 'mysql';
import util from 'util';
import { logger } from './logger';

dotenv.config();
const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_PORT,
} = process.env;

const mySqlConnection = () => {
  const connection = mysql.createPool({
    connectionLimit: 10,
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: (MYSQL_PORT as unknown) as number,
  });
  return connection;
};

// redefining query because we promisify it below
interface Db extends Omit<mysql.Pool, 'query'> {
  query: <T extends object>(options: string) => Promise<T[]>;
}
export const db = (mySqlConnection() as unknown) as Db;
db.query = util.promisify(db.query);

// Test for common db connection errors then quit
db.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      logger.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      logger.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      logger.error('Database connection was refused.');
    }
  }
  if (connection) {
    connection.release();
  }
  return;
});
