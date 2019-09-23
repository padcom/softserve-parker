import {
  Field,
  ID,
  ObjectType
} from 'type-graphql'
  
@ObjectType({
  description: 'Object representing user.',
})
export class Session {
  @Field(() => ID)
  id: number

  @Field(() => String)
  token: string
}