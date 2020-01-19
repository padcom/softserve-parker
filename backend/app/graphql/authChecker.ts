import { AuthChecker } from 'type-graphql'
import { User } from '../domain/User'
import { GraphQLContext } from './context';

export const authChecker: AuthChecker<GraphQLContext> = async ({ context }, roles) => {
  if (roles.length === 0) {
    return context.user !== undefined;
  }

  const user = await User.byEmail(context.user)

  return user.roles.split(',').some(role => roles.includes(role))
}
