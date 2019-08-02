import { Field, ID, ObjectType, Query, Resolver } from 'type-graphql';

@ObjectType({ description: 'Rocket launch type' })
export class Launch {
  @Field(type => ID)
  id: string;

  @Field()
  title: string;
}

@Resolver(Launch)
export class LaunchResolver {
  @Query(() => Launch)
  launches() {
    return { id: 'xd', title: 'foo' };
  }
}
