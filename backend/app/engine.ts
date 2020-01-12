import addSeconds from 'date-fns/addSeconds'
import { User } from './domain/User'
import { History } from './domain/History'
import { ReservationRequest } from './domain/ReservationRequest'

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
  numberOfTimesParked: number
  requestTimestamp: Date | null
}

export interface Ranking {
  timestamp: Date
  users: RankingUser[]
  history: History[]
  requests: ReservationRequest[]
}

// value used for comparison of ranking users when the user has not posted a request
const NO_REQUEST_TIMESTAMP = 32503676399000

export async function calculateRanking(users: User[], history: History[], requests: ReservationRequest[]): Promise<RankingUser[]> {
  function getNumberOfTimesUserParked(userId) {
    return history
      .filter(entry => entry.state === 'used')
      .reduce((acc, entry) => acc + (entry.userId === userId ? 1 : 0), 0)
  }

  function getUserRequestTimestamp(userId) {
    const request = requests.find(request => request.userId === userId)
    return new Date(request?.date || NO_REQUEST_TIMESTAMP)
  }
  
  function sign(value) {
    if (value < 0) return -1
    else if (value > 0) return 1
    else return 0
  }

  function convertUserToRankingUser(user: User): RankingUser {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      rank: null,
      numberOfTimesParked: getNumberOfTimesUserParked(user.id),
      requestTimestamp: getUserRequestTimestamp(user.id),
    }
  }

  function compareRankingUsers(user1: RankingUser, user2: RankingUser): number {
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

  function updateUserRank(user: RankingUser, rank: number) {
    return {
      ...user,
      rank,
    }
  }

  function removeRequestTimestampIfUserDidNotRequestParkingSpot(user: RankingUser): RankingUser {
    return {
      ...user,
      requestTimestamp: user.requestTimestamp.getTime() === NO_REQUEST_TIMESTAMP ? null : user.requestTimestamp
    }
  }

  return users
    .map(convertUserToRankingUser)
    .sort(compareRankingUsers)
    .map(removeRequestTimestampIfUserDidNotRequestParkingSpot)
    .map(updateUserRank)
}

function dumpUsers(users: User[]) {
  console.log('--- users:', users.length)
  users.forEach(user => {
    console.log('USER:', user.id, user.email, user.roles)
  })
}

function dumpHistoryEntries(history: History[]) {
  console.log('--- active history entries:', history.length)
  history.forEach(async (entry) => {
    console.log('HISTORY:', entry.date, entry.userId, entry.state)
  })
}

function dumpRequests(requests: ReservationRequest[]) {
  console.log('--- requests', requests.length)
  requests.forEach(request => {
    console.log('REQUEST:', request.userId, request.date)
  })
}

async function calculateRankingForDates(timestamp: Date, timeOfRankingStart: Date, timeOfFirstRequest: Date): Promise<Ranking> {
  console.log('Calculating ranking from history starting at', timeOfRankingStart)
  console.log('Requests from', timeOfFirstRequest, 'to', timestamp)

  const users = await User.getAllActiveUsers()
  const history = await History.getHistorySince(timeOfRankingStart)
  const requests = await ReservationRequest.getAllByDay(timeOfFirstRequest, timestamp)

  dumpUsers(users)
  dumpHistoryEntries(history)
  dumpRequests(requests)

  return {
    timestamp,
    history,
    requests,
    users: await calculateRanking(users, history, requests),
  }
}

export async function calculateCurrentRanking(numberOfSeconds: number = 8): Promise<Ranking> {
  const timestamp = new Date()
  const timeOfRankingStart = addSeconds(timestamp, -((numberOfSeconds + 2) * 10))
  const timeOfFirstRequest = addSeconds(timestamp, -numberOfSeconds - 2)

  return {
    timestamp,
    ...await calculateRankingForDates(timestamp, timeOfRankingStart, timeOfFirstRequest)
  }
}

function dumpRankingUsers(users: RankingUser[]) {
  console.log('--- ranking')
  users.map(async (user, index) => {
    if (user.requestTimestamp === null) {
      console.log(index, user.id, user.email, user.numberOfTimesParked, user.roles)
    } else {
      console.log(index, user.id, user.email, user.numberOfTimesParked, user.requestTimestamp, user.roles)
    }
  })
}

export function calculateWinners(users: RankingUser[], numberOfParkingSpots: number) {
  function hasRequestedParkingSpot(user: RankingUser) {
    return user.requestTimestamp != null
  }

  return users
    .filter(hasRequestedParkingSpot)
    .take(numberOfParkingSpots)
}

function dumpWinners(users: RankingUser[]) {
  console.log('--- lucky winners')
  users.forEach(user => {
    console.log(user.id, user.email, user.roles)
  })
}

async function createHistoryEntriesForWinners(timestamp: Date, winners: RankingUser[]): Promise<number[]> {
  return Promise.all(winners.map(async (user) => {
    return await History.create(timestamp, user.id)
  }))
}

async function createRandomReservationRequests(timestamp: Date) {
  const users = await User.getAllActiveUsers()
  const numberOfRequests = Math.floor(Math.random() * users.length) + 1

  // create reservation requests 
  await Promise.all(users.clone().randomize().take(numberOfRequests).map(async (user, index) => {
    const date = addSeconds(timestamp, -index - 1)
    return await ReservationRequest.create(user.id, [ date ], false)
  }))
}

export async function engine(): Promise<void> {
  console.log('Engine running')

  // TESTING: create a set of random requests
  await createRandomReservationRequests(new Date())

  const { users, timestamp } = await calculateCurrentRanking()
  dumpRankingUsers(users)

  const numberOfParkingSpots = 2
  const winners = calculateWinners(users, numberOfParkingSpots)
  dumpWinners(winners)
  createHistoryEntriesForWinners(timestamp, winners)
}
