Here we're using TypeGraphQL - a library that joins TypeScript interfaces and GraphQL typedefs together.

Why?

Because if we didn't have typegraphql, we would have only TypeScript and plain graphql.
This means you would need to:

1. Create graphql typedefs separately
2. Create ts interfaces separately

So without TypeGraphQl, it would look like this:

```
// personTypedefs.ts
type Person {
  id: Int!
  name: String!
}

// personTypescript.ts
interface Person {
  id: number,
  name: string
}

// personService.ts
return db.query('SELECT * FROM People') as Person[]

```

However with TypeGraphQL, it looks like this:

```
typedefs.ts
class People {
  @Field(() => ID)
  id: number

  @Field()
  name: string
}

// service.ts
return db.query('SELECT * FROM People') as Person[]
```

The class is both a TS interface and a typedef (in one).
