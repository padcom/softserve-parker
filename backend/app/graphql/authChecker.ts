import { AuthChecker } from 'type-graphql'
import { User } from '../domain/User'
import { GraphQLContext } from './context';

// create auth checker function
export const authChecker: AuthChecker<GraphQLContext> = async ({ context }, roles) => {
  console.log('CONTEXT:', context.user)
  if (roles.length === 0) {
    return context.user !== undefined;
  }

  const user = await User.getByEmail(context.user)

  return user.roles.split(',').some(role => roles.includes(role))
}
