import parse from 'date-fns/parse'
import addSeconds from 'date-fns/addSeconds'
import { User } from './domain/User'
import { History } from './domain/History'
import { ReservationRequest } from './domain/ReservationRequest'

export async function engine(): Promise<void> {
  console.log('Engine running')

  const numberOfParkingSpots = 2

  const timestamp = new Date()
  const numberOfSeconds = 8
  const timeOfRankingStart = addSeconds(timestamp, -((numberOfSeconds + 2) * 10))
  const timeOfFirstRequest = addSeconds(timestamp, -numberOfSeconds - 2)

  console.log('Calculating ranking from history starting at', timeOfRankingStart)

  console.log('Requests from', timeOfFirstRequest, 'to', timestamp)

  const users = await User.getAllActiveUsers()

  // create reservation requests 
  await Promise.all(users.clone().randomize().take(3).map(async (user, index) => {
    const date = addSeconds(timestamp, -index - 1)
    await ReservationRequest.create(user.id, [ date ], false)
  }))

  const history = await History.getHistorySince(timeOfRankingStart)
  const requests = await ReservationRequest.getAllByDay(timeOfFirstRequest, timestamp)

  console.log('> number of active users:', users.length)
  users.forEach(user => {
    console.log('USER:', user.email, user.roles)
  })
  console.log('> number of active history entries:', history.length)
  history.forEach(async (entry) => {
    console.log('HISTORY:', entry.date, entry.userId, entry.state)
  })
  console.log('> number of requests', requests.length)
  requests.forEach(request => {
    console.log('REQUEST:', request.userId, request.date)
  })

  function hasRequestedParkingSpot(userId) {
    return requests.some(request => request.userId === userId)
  }
  
  function numberOfTimesParked(userId) {
    return history
      .filter(entry => entry.state === 'used')
      .reduce((acc, entry) => acc + (entry.userId === userId ? 1 : 0), 0)
  }
  
  function requestTimeStamp(userId) {
    const NO_REQUEST_TIMESTAMP = '2999-12-31 23:59:59'
    const request = requests.find(request => request.userId === userId)
    return new Date(request?.date || NO_REQUEST_TIMESTAMP).getTime()
  }
  
  function sign(value) {
    if (value < 0) return -1
    else if (value > 0) return 1
    else return 0
  }
  
  console.log('--- ranking')
  
  const ranking = users
    .map(user => ({
      ...user,
      numberOfTimesParked: numberOfTimesParked(user.id),
      requestTimeStamp: requestTimeStamp(user.id)
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

  ranking
    .forEach((user, index) => {
      if (new Date(user.requestTimeStamp).getFullYear() > 2100) {
        console.log(index, user.id, user.email, user.numberOfTimesParked, 'no request')
      } else {
        console.log(index, user.id, user.email, user.numberOfTimesParked, new Date(user.requestTimeStamp))
      }
    })
  
  console.log('--- lucky winners')
  
  await Promise.all(ranking
    .filter(user => hasRequestedParkingSpot(user.id))
    .take(numberOfParkingSpots)
    .map(async (user) => {
      await History.create(timestamp, user.id)
      console.log(user.id, user.email)
    })
  )
}
