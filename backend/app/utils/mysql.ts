import mysql from 'mysql';
import { logger } from './logger';

const mySqlInstance = () => {
  try {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'test',
      database: 'test',
    });
    return connection;
  } catch (e) {
    logger.error(`Error connecting to MySQL database. ${e}`);
  }
};

export const mySqlConnection = mySqlInstance();
export const db = mySqlConnection.connect();
