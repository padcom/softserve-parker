import { db } from '../../../mysql'
import { ParkingSpots } from './typedefs'

class Service {
  /**
   * Returns parking spots. Will return as many parking spots as provided in the argument
   *
   * @param {skip} skip Controls the number of parking spots skipped from the beginning
   * @param {number} limit Controls the number of parking spots that will be returned
   * @returns First X parking spots
   * @memberof Service
   */
  async fetch(skip: number, limit: number): Promise<ParkingSpots[]> {
    const [ rows ] = await db.execute(`SELECT * FROM parkingspot LIMIT ?,?`, [ skip, limit ])
    return rows as ParkingSpots[]
  }
}

export const ParkingSpotService = new Service()
