import { db } from '../../../utils/mysql';

class Service {
  /**
   * Get all launches
   *
   * @memberof LaunchServiceg
   */
  async launches(first?: number) {
    const limit = first ? `LIMIT ${first}` : '';
    return db.query(`SELECT * FROM parking_spots ${limit}`);
  }
}

export const LaunchService = new Service();
