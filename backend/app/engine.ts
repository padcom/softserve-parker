import { User } from './domain/User'
import { History } from './domain/History'
import { ReservationRequest } from './domain/ReservationRequest'
import { Settings } from './domain/Settings'
import { format, parse, addMinutes, addDays } from 'date-fns'

// Example apache benchmark enchantation to test the performance of the engine through ranking
//
// ab -p request.json -T application/json \
//   -c 5 \
//   -n 1000 \
//   -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjMsImVtYWlsIjoidGVzdDNAc29mdHNlcnZlaW5jLmNvbSIsImlhdCI6MTU3ODQyNzAyNH0.HrxhwXb3pmWg-QXJstku10RFIHMmwYFyT4KiaZnKr4v9oZSS2m3-ph8GEqY9vioc9EszRY3WoSCq0q6VIoHHsQ' \
//   http://localhost:3000/graphql
//
// request.json:
//   { "query": "{ ranking { user { email roles rank } } }" }

export interface RankingUser {
  id: number
  email: string
  roles: string
  rank: number | null
  plate: string
  numberOfTimesParked: number
  requestTimestamp: Date | null
  request: ReservationRequest
}

export interface Ranking {
  timestamp: string
  users: RankingUser[]
  history: History[]
  requests: ReservationRequest[]
}

export async function calculateUserRankings (users: User[], history: History[], requests: ReservationRequest[]): Promise<RankingUser[]> {
  // value used for comparison of ranking users when the user has not posted a request
  const NO_REQUEST_TIMESTAMP = 32503676399000

  function getNumberOfTimesUserParked (userId) {
    return history
      .filter(entry => entry.state === 'used')
      .reduce((acc, entry) => acc + (entry.userId === userId ? 1 : 0), 0)
  }

  function getUserRequest (userId) {
    return requests.find(request => request.userId === userId)
  }

  function getUserRequestTimestamp (userId) {
    const request = getUserRequest(userId)
    return new Date(request?.date || NO_REQUEST_TIMESTAMP)
  }
  
  function sign (value) {
    if (value < 0) return -1
    else if (value > 0) return 1
    else return 0
  }

  function convertUserToRankingUser (user: User): RankingUser {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      rank: null,
      plate: user.plate,
      numberOfTimesParked: getNumberOfTimesUserParked(user.id),
      requestTimestamp: getUserRequestTimestamp(user.id),
      request: getUserRequest(user.id),
    }
  }

  function compareRankingUsers (user1: RankingUser, user2: RankingUser): number {
    let result = 0
  
    if (user1.roles === 'vip' && user2.roles !== 'vip') result = -1
    if (result === 0 && user1.roles !== 'vip' && user2.roles === 'vip') result = 1
    if (result === 0) {
      result = sign(user1.numberOfTimesParked - user2.numberOfTimesParked)
    }
    if (result === 0) {
      result = sign(user1.requestTimestamp.getTime() - user2.requestTimestamp.getTime())
    }

    return result
  }

  function updateUserRank (user: RankingUser, rank: number) {
    return {
      ...user,
      rank,
    }
  }

  function removeRequestTimestampIfUserDidNotRequestParkingSpot (user: RankingUser): RankingUser {
    return {
      ...user,
      requestTimestamp: user.requestTimestamp.getTime() === NO_REQUEST_TIMESTAMP ? null : user.requestTimestamp,
    }
  }

  return users
    .map(convertUserToRankingUser)
    .sort(compareRankingUsers)
    .map(removeRequestTimestampIfUserDidNotRequestParkingSpot)
    .map(updateUserRank)
}

function dumpUsers (users: User[]) {
  console.log('--- users:', users.length)
  users.forEach(user => {
    console.log('USER:', user.id, user.email, user.roles)
  })
}

function dumpHistoryEntries (history: History[]) {
  console.log('--- active history entries:', history.length)
  history.forEach(async (entry) => {
    console.log('HISTORY:', entry.date, entry.userId, entry.state)
  })
}

function dumpRequests (requests: ReservationRequest[]) {
  console.log('--- requests', requests.length)
  requests.forEach(request => {
    console.log('REQUEST:', request.userId, request.date)
  })
}

async function calculateRankingForDates (timestamp: string, timeOfRankingStart: string, timeOfFirstRequest: string): Promise<Ranking> {
  console.log('Calculating ranking from history starting at', timeOfRankingStart)
  console.log('Requests from', timeOfFirstRequest, 'to', timestamp)

  const users = await User.active()
  const history = await History.between(timeOfRankingStart, timestamp)
  const requests = (await ReservationRequest.between(timeOfFirstRequest, timestamp))
    .filter(request => request.status === '')

  dumpUsers(users)
  dumpHistoryEntries(history)
  dumpRequests(requests)

  return {
    timestamp,
    history,
    requests,
    users: await calculateUserRankings(users, history, requests),
  }
}

export async function calculateCurrentRanking (numberOfDays = 8): Promise<Ranking> {
  const timestamp = await Settings.today()
  const timeOfRankingStart = format(addDays(parse(timestamp, 'yyyy-MM-dd', new Date()), -numberOfDays), 'yyyy-MM-dd')
  const timeOfFirstRequest = format(addDays(parse(timestamp, 'yyyy-MM-dd', new Date()), -1), 'yyyy-MM-dd')

  return {
    timestamp,
    ...await calculateRankingForDates(timestamp, timeOfRankingStart, timeOfFirstRequest),
  }
}

function dumpRankingUsers (users: RankingUser[]) {
  console.log('--- ranking')
  users.map(async (user, index) => {
    if (user.requestTimestamp === null) {
      console.log(index, user.id, user.email, user.numberOfTimesParked, user.roles)
    } else {
      console.log(index, user.id, user.email, user.numberOfTimesParked, user.requestTimestamp, user.roles)
    }
  })
}

export function calculateWinners (users: RankingUser[], numberOfParkingSpots: number) {
  console.log('--- calculating list of winners')
  function hasRequestedParkingSpot (user: RankingUser) {
    return user.requestTimestamp != null
  }

  return users
    .filter(hasRequestedParkingSpot)
    .take(numberOfParkingSpots)
}

function dumpWinners (users: RankingUser[]) {
  console.log('--- lucky winners')
  users.forEach(user => {
    console.log(user.id, user.email, user.roles)
  })
}

export function calculateLoosers (users: RankingUser[], numberOfParkingSpots: number) {
  console.log('--- calculating list of loosers')
  function hasRequestedParkingSpot (user: RankingUser) {
    return user.requestTimestamp != null
  }

  return users
    .filter(hasRequestedParkingSpot)
    .skip(numberOfParkingSpots)
}

async function createHistoryEntriesForWinners (timestamp: string, numberOfParkingSpots: number, numberOfRequests: number, winners: RankingUser[]): Promise<number[]> {
  console.log('--- creating history entries for winners')
  return Promise.all(winners.map(async (user) => {
    return await History.create(timestamp, numberOfParkingSpots, numberOfRequests, user.id, user.plate, user.rank)
  }))
}

async function updateWinnerRequests (winners: RankingUser[]) {
  console.log('--- updating won requests')
  return Promise.all(winners.map(async (user) => {
    await ReservationRequest.updateStatus(user.request.id, 'won')
    await ReservationRequest.updateRank(user.request.id, user.rank)
  }))
}

async function updateLoosersRequests (winners: RankingUser[]) {
  console.log('--- updating lost requests')
  return Promise.all(winners.map(async (user) => {
    await ReservationRequest.updateStatus(user.request.id, 'lost')
    await ReservationRequest.updateRank(user.request.id, user.rank)
  }))
}

export async function engine (): Promise<void> {
  console.log('Engine running at', new Date())

  const settings = await Settings.all()

  const { users, requests, timestamp } = await calculateCurrentRanking(settings.daysForCalculation)
  dumpRankingUsers(users)

  const winners = calculateWinners(users, settings.numberOfParkingSpots)
  dumpWinners(winners)
  await createHistoryEntriesForWinners(timestamp, settings.numberOfParkingSpots, requests.length, winners)
  await updateWinnerRequests(winners)
  const loosers = calculateLoosers(users, settings.numberOfParkingSpots)
  await updateLoosersRequests(loosers)
}

function isTimeToRunTheEngine (deadlineHour: string): boolean {
  return deadlineHour === format(new Date(), 'HH:mm')
}

export async function task (): Promise<void> {
  const settings = await Settings.all()
  if (isTimeToRunTheEngine(settings.deadlineHour)) engine()
}

export async function createRandomReservationRequests (timestamp: Date) {
  const users = await User.active()
  const numberOfRequests = Math.floor(Math.random() * users.length) + 1

  // create reservation requests 
  await Promise.all(users.clone().randomize().take(numberOfRequests).map(async (user, index) => {
    const date = addMinutes(timestamp, -index - 1)
    return await ReservationRequest.create(user.id, [ format(date, 'yyyy-MM-dd') ], false)
  }))
}
