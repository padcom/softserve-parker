import { User } from './domain/User'

export async function engine(): Promise<void> {
  const users = await User.getAllActiveUsers()
  console.log('Engine running; number of active users:', users.length)
}
