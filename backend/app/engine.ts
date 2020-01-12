import addSeconds from 'date-fns/addSeconds'
import { User } from './domain/User'
import { History } from './domain/History'
import { ReservationRequest } from './domain/ReservationRequest'

// ab -p request.json -T application/json \
//   -c 5 \
//   -n 1000 \
//   -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjMsImVtYWlsIjoidGVzdDNAc29mdHNlcnZlaW5jLmNvbSIsImlhdCI6MTU3ODQyNzAyNH0.HrxhwXb3pmWg-QXJstku10RFIHMmwYFyT4KiaZnKr4v9oZSS2m3-ph8GEqY9vioc9EszRY3WoSCq0q6VIoHHsQ' \
//   http://localhost:3000/graphql

interface RankingUser {
  id: number
  email: string
  roles: string
  rank: number
  numberOfTimesParked: number
  requestTimeStamp: Date
}

interface Ranking {
  timestamp: Date
  timeOfFirstRequest: Date
  timeOfRankingStart: Date
  users: RankingUser[]
  requests: ReservationRequest[]
}

const NO_REQUEST_TIMESTAMP = 32503676399000

export async function calculateRanking(timestamp: Date = new Date()): Promise<Ranking> {
  const numberOfSeconds = 8
  const timeOfRankingStart = addSeconds(timestamp, -((numberOfSeconds + 2) * 10))
  const timeOfFirstRequest = addSeconds(timestamp, -numberOfSeconds - 2)

  console.log('Calculating ranking from history starting at', timeOfRankingStart)
  console.log('Requests from', timeOfFirstRequest, 'to', timestamp)

  const users = await User.getAllActiveUsers()
  const history = await History.getHistorySince(timeOfRankingStart)
  const requests = await ReservationRequest.getAllByDay(timeOfFirstRequest, timestamp)

  console.log('--- users:', users.length)
  users.forEach(user => {
    console.log('USER:', user.id, user.email, user.roles)
  })
  console.log('--- active history entries:', history.length)
  history.forEach(async (entry) => {
    console.log('HISTORY:', entry.date, entry.userId, entry.state)
  })

  function numberOfTimesParked(userId) {
    return history
      .filter(entry => entry.state === 'used')
      .reduce((acc, entry) => acc + (entry.userId === userId ? 1 : 0), 0)
  }

  function requestTimeStamp(userId) {
    const request = requests.find(request => request.userId === userId)
    return new Date(request?.date || NO_REQUEST_TIMESTAMP).getTime()
  }
  
  function sign(value) {
    if (value < 0) return -1
    else if (value > 0) return 1
    else return 0
  }
  
  return {
    timestamp,
    timeOfRankingStart: new Date(timeOfRankingStart),
    timeOfFirstRequest: new Date(timeOfFirstRequest),
    requests,
    users: users
      .map(user => ({
        id: user.id,
        email: user.email,
        roles: user.roles,
        numberOfTimesParked: numberOfTimesParked(user.id),
        requestTimeStamp: requestTimeStamp(user.id),
      }))
      .sort((user1, user2) => {
        let result = 0
    
        if (user1.roles === 'vip' && user2.roles !== 'vip') result = -1
        if (result === 0 && user1.roles !== 'vip' && user2.roles === 'vip') result = 1
        if (result === 0) {
          result = sign(user1.numberOfTimesParked - user2.numberOfTimesParked)
        }
        if (result === 0) {
          result = sign(user1.requestTimeStamp - user2.requestTimeStamp)
        }
    
        return result
      })
      .map((user, rank) => ({
        ...user, 
        rank,
        requestTimeStamp: user.requestTimeStamp === NO_REQUEST_TIMESTAMP ? null : new Date(user.requestTimeStamp)
      }))
    }
}

async function createRandomRequests(timestamp: Date) {
  const users = await User.getAllActiveUsers()
  const numberOfRequests = Math.floor(Math.random() * users.length + 1)

  // create reservation requests 
  await Promise.all(users.clone().randomize().take(numberOfRequests).map(async (user, index) => {
    const date = addSeconds(timestamp, -index - 1)
    return await ReservationRequest.create(user.id, [ date ], false)
  }))
}

export async function engine(): Promise<void> {
  console.log('Engine running')

  const timestamp = new Date()

  await createRandomRequests(timestamp)

  const { users, requests } = await calculateRanking(timestamp)

  console.log('--- requests', requests.length)
  requests.forEach(request => {
    console.log('REQUEST:', request.userId, request.date)
  })

  console.log('--- ranking')

  users.map(async (user, index) => {
    if (!user.requestTimeStamp) {
      console.log(index, user.id, user.email, user.numberOfTimesParked, user.roles)
    } else {
      console.log(index, user.id, user.email, user.numberOfTimesParked, user.requestTimeStamp, user.roles)
    }
  })

  console.log('--- lucky winners')

  const numberOfParkingSpots = 2

  function hasRequestedParkingSpot(userId) {
    return requests.some(request => request.userId === userId)
  }

  await Promise.all(users
    .filter(user => hasRequestedParkingSpot(user.id))
    .take(numberOfParkingSpots)
    .map(async (user) => {
      console.log(user.id, user.email, user.roles)
      await History.create(timestamp, user.id)
    })
  )
}
