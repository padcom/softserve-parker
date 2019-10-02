import { db } from '../db'
import { Field, ID, ObjectType } from 'type-graphql'
import { OkPacket, FieldPacket, RowDataPacket } from 'mysql'

@ObjectType({
  description: 'Returns all parking spots.',
})
export class ParkingSpot {
  @Field(() => ID)
  id: number

  @Field(() => Boolean)
  reserved: boolean

  @Field(() => Date)
  created: Date

  /**
   * Returns parking spots. Will return as many parking spots as provided in the argument
   *
   * @param {skip} skip Controls the number of parking spots skipped from the beginning
   * @param {number} limit Controls the number of parking spots that will be returned
   * @returns First X parking spots
   * @memberof Service
   */
  static async getOne(id: number) {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.execute(
      `
      SELECT *
      FROM parkingspot
      WHERE id = ?
      `,
      [id]
    )
    if (rows.length === 0) throw new Error("Can't find a ")
    return rows as ParkingSpot[]
  }

  static async fetch(skip: number, limit: number): Promise<ParkingSpot[]> {
    const [rows] = await db.execute(
      `SELECT * FROM parkingspot
       ORDER BY id LIMIT ?,?`,
      [skip, limit]
    )
    return rows as ParkingSpot[]
  }

  static async setReservation(status: boolean, id: number) {
    const [rows]: [OkPacket, FieldPacket[]] = await db.execute(
      `
      UPDATE parkingspot
      SET reserved = ?
      WHERE id = ?
      `,
      [status, id]
    )
    if (rows.affectedRows === 0)
      throw new Error("Can't find such parking spot ID")

    const [updated] = await this.getOne(id)

    return updated
  }
}
