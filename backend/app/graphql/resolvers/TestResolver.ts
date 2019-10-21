import { Arg, Query, Resolver, ObjectType, Field } from 'type-graphql'
import { User } from '../../domain/User'

@ObjectType({
  description: 'Test object'
})
class Test {
  @Field(() => String)
  message = 'Hello'
}

@Resolver(Test)
export class TestResolver {
  @Query(() => Test!)
  async test () {
    return new Test()
  }
}
