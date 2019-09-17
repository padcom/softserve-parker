import { db } from '../../../utils/mysql'
import { ParkingSpots } from './typeDefs'

class Service {
  /**
   * Returns parking spots. Will return as many parking spots as provided in the argument
   *
   * @param {number} limit Controles the number of parking spots that will be returned
   * @returns First X parking spots
   * @memberof Service
   */
  async getAllLimit(limit: number): Promise<ParkingSpots[]> {
    const [ rows ] = await db.execute(`SELECT * FROM parkingSpots LIMIT ?`, [ limit ])
    return rows as ParkingSpots[]
  }
}

export const ParkingSpotService = new Service()
