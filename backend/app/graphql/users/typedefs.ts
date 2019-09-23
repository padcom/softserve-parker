import {
  Field,
  ID,
  ObjectType
} from 'type-graphql'
  
@ObjectType({
  description: 'Object representing user.',
})
export class User {
  @Field(() => ID)
  id: number
  
  @Field(() => String)
  email: string

  @Field(() => Boolean)
  reserved: boolean

  @Field(() => Date)
  created: Date

  @Field(() => String)
  password: string

  @Field(() => Number)
  rank: number 

  @Field(() => Boolean)
  enabled: boolean
}