import { ReservationRequestResolver } from '../../resolvers/ReservationRequestResolver'
import { User } from '../../../domain/User'
import { ReservationRequest } from '../../../domain/ReservationRequest'
import { logger } from '../../../logger'

const date = new Date()
date.setHours(23)
date.setMinutes(59)
date.setSeconds(59)
date.setMilliseconds(0)
const date2 = new Date(date.getTime())
date2.setSeconds(58)
const date3 = new Date(date.getTime())
date3.setSeconds(57)

let user: User;
const email = "fakeemailfortesting@testing.fake.com"

beforeAll(async () => {
  await User.create(email, "supersecurepassword", "John", "Lock", "BO PARKER", 123123123)
  user = await User.getByEmail(email)
  await ReservationRequest.create(user.id, [date, date2, date3])
})

afterAll(async () => {
  await User.delete(email)
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
    expect(error.message).toBe('Provided date is in the past.');
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
      logger.error(e)
    }

    expect(result.length).toBe(1)
    expect(result[0].date.getTime()).toBe(localDate.getTime())

    await ReservationRequest.delete(user.id, localDate)
  })

  test('Returns reservation requests starting from given date', async () => {
    const result = await rr.reservationRequests(user.id, date)
    expect(result.length).toBeTruthy()
    expect(result[0].date.getTime()).toBe(date.getTime())
  })

  test('Deletes request for given id', async () => {
    let result
    let deletionResult
    const localDate = new Date()
    localDate.setMilliseconds(0)
    localDate.setSeconds(400)

    try {
      result = await rr.createReservationRequest(user.id, [localDate])
      deletionResult = await rr.cancelReservationRequest(result[0].id)
    } catch (e) {
      logger.error(e)
    }

    expect(deletionResult).toBe(1)
  })
})

