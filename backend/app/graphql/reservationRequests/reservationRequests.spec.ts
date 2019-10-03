import { ReservationRequestResolver } from './'
import { db } from '../../db'
import { UserService, User } from '../users'

const date = new Date()
const date2 = new Date()
const date3 = new Date()
date.setMilliseconds(0)
date.setSeconds(10)
date2.setMilliseconds(0)
date2.setSeconds(20)
date3.setMilliseconds(0)
date3.setSeconds(30)


let user: User;
const email = "fakeemailfortesting@testing.fake.com"

beforeAll(async () => {
  await db.execute(`
		INSERT INTO user
    (email, password) VALUES (?, "supersecurepassword")`,
    [email]
  )
  user = await UserService.getUserByEmail(email)
})

afterAll(async () => {
  await db.execute(`
    DELETE from user
    WHERE email = ?`,
    [email]
  )
})


beforeEach(async () => {
	await db.execute(`
		INSERT INTO reservationRequest
		(userId, date, status) 
    VALUES (?, ?, "pending"), (?, ?, "pending"), (?, ?, "pending")`,
    [user.id, date, user.id, date2, user.id, date3]
	)
})

afterEach(async () => {
	await db.execute(`
		DELETE from reservationRequest
    WHERE userId = 4 AND date IN (?, ?, ?)`,
    [date, date2, date3]
	)
})

const rr = new ReservationRequestResolver()

describe('Reservation Requests', () => {
  test('Throws error when inserting existing date', async () => {
    let error;
    try {
      await rr.createReservationRequest(user.id, [date])
    } catch (e) {
      error = e
    }
    expect(error.message).toBe('Request already exist');
  })

  test('Throws error when provided date is in the past', async () => {
    let error
    try {
      await rr.createReservationRequest(4, [new Date('2018-10-03 00:00:00.000')])
    } catch (e) {
      error = e
    }
    expect(error.message).toBe('Provided date is in the past. Wed Oct 03 2018 00:00:00 GMT+0200 (Central European Summer Time)');
  })

  test('Throws error when provided duplicate dates', async () => {
    let error
    try {
      await rr.createReservationRequest(user.id, [date, date])
    } catch (e) {
      error = e
    }
    expect(error.message).toBe('Provided date range contains duplicates.')
  })

  test('Returns newly created requests when succesfull', async () => {
    let result
    const localDate = new Date()
    localDate.setMilliseconds(0)
    localDate.setSeconds(400)

    try {
      result = await rr.createReservationRequest(user.id, [localDate])
    } catch (e) {
      console.log(e)
    }

    expect(result.length).toBe(1)
    expect(result[0].date.getTime()).toBe(localDate.getTime())

    await db.execute(`
      DELETE from reservationRequest
      WHERE userId = 4 AND date = ?`,
      [localDate]
    )
  })

  test('Returns reservation requests starting from given date', async () => {
    const result = await rr.reservationRequests(user.id, date)
    expect(result.length).toBeTruthy()
    expect(result[0].date.getTime()).toBe(date.getTime())
  })
})

