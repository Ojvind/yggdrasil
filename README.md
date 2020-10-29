# Yggdrasil

A GraphQL Server implemented from all the steps in the tutorial: [GraphQL Server Tutorial with Apollo Server and Express](https://www.robinwieruch.de/graphql-apollo-server-tutorial/).

[Repository with MongoDB implementation](https://github.com/the-road-to-graphql/fullstack-apollo-express-mongodb-boilerplate)

YGGDRASIL: Verlden föreställes också under bilden af ett träd. Askträdet Yggdrasil (fn. Yggdrasill) är bilden af verlden såsom ett helt, såsom en enda stor organism. Det beskrifves sålunda. Det är det största och bästa träd; dess grenar utbreda sig öfver hela verlden och nå upp öfver himmelen. Det har tre rötter, som sträcka sig öfver måttan vida. Den ena roten är hos åsarne, den andra hos rimtursarne, den tredje i Nifelheim. Till hvarje rot hör en källa. Hvärgälme (se § 1) är under den sista, och der gnager ormen Nidhugg (fn. Nidhöggr) roten nedantill. Under rimtursarnes [ 26 ]rot är Mimes brunn (fn. Mimis brunnr); i honom äro klokskap och mannavett dolda. Mime (fn. Mimir), som eger den samma, är full af visdom, ty han dricker hvar dag af källan. Dit kom Odin och bad om en dryck ur källan, men fick honom icke, förrän han satt sitt ena öga i pant. Askens tredje rot når upp till himmelen, och under denna är den heliga brunn, som kallas Urds brunn (fn. Urðarbrunnr). Der hafva gudarne sitt domställe. Hvarje dag rida åsarne dit öfver Bäfrast eller åsabron, undantagandes Tor, som går till fots och vadar öfver flere floder. Der står en fager sal under asken vid brunnen, och från den samma komma tre mör, som kallas Nornor (se § 12). Dessa nornor hemta hvar dag vatten ur brunnen, hvilket de ösa öfver asken, att hennes grenar ej må vissna. Detta vatten är så heligt, att alla ting, som komma deri, blifva hvitare än ägghinnan. Daggen, som faller från trädet på jorden, kallas honungsfall, och deraf näras bina. Tvänne foglar födas i Urds brunn; de heta svanor, och från dem härstammar detta fogelslägte. Det sitter en örn i askens grenar, som är kunnig om mycket, och mellan hans ögon sitter höken Väderfalne (fn. Veðrfölnir). En ekorre, Ratatosk (fn. Ratatöskr), springer beständigt upp och ned i asken, samt bringar afundsord mellan örnen och Nidhugg. Dessutom äro der fyra hjortar, som löpa omkring i askens grenar och bita löf; men i Hvärgälme hos Nidhugg äro så många ormar, att ingen tunga kan säga det.

## Installation

* `git clone git@github.com:the-road-to-graphql/react-graphql-github-apollo.git`
* cd react-graphql-github-apollo
* npm install
* npm start
* visit `http://localhost:3000`

## From the Tutorial
#### [Apollo Server Setup with Express](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#apollo-server-setup-express)
#### [Type Definitions](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#apollo-server-type-definitions)
#### Resolvers
#### Type Relationships
#### Queries and Mutations
#### GraphQL Schema Stitching with Apollo Server
#### Technical Separation
#### Domain Separation
#### PostgreSQL with Sequelize for a GraphQL Server
#### Connecting Resolvers and Database
#### Validation and Errors
#### Authentication
#### Registration (Sign Up) with GraphQL
#### Securing Passwords with Bcrypt
#### Token based Authentication in GraphQL
#### Login (Sign In) with GraphQL
#### Authorization with GraphQL and Apollo Server
#### GraphQL Authorization on a Resolver Level
#### Permission-based GraphQL Authorization
#### Role-based GraphQL Authorization
#### Setting Headers in GraphQL Playground
#### GraphQL Custom Scalars in Apollo Server
#### Pagination in GraphQL with Apollo Server
#### Offset/Limit Pagination with Apollo Server and GraphQL
#### Cursor-based Pagination with Apollo Server and GraphQL
#### Cursor-based Pagination: Page Info, Connections and Hashes
#### [GraphQL Subscriptions](https://www.robinwieruch.de/graphql-apollo-server-tutorial/#graphql-subscriptions)
#### Apollo Server Subscription Setup
#### Subscribing and Publishing with PubSub
#### Testing a GraphQL Server
#### GraphQL Server E2E Test Setup
#### Testing User Scenarios with E2E Tests
#### [Batching and Caching in GraphQL with Data Loader](https://www.robinwieruch.de/graphql-apollo-server-tutorial#batching-and-caching-in-graphql-with-data-loader)
#### GraphQL Server + PostgreSQL Deployment to Heroku
#### Heroku Troubleshoot
### ---

```graphql
# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# xxxxxxxxxxxxxxxxx
# Queries that doesn't need signin
query users {
  users {
    id
    username
    email
    role
  }
}

query messages {
  messages(limit:2) {
    edges{
      id
      text
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# Returns token, use it as followed in HTTP-headers
# {
#  "x-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNDk2ZTBhNWVjZTQ4MWJkODBkZWViMyIsImVtYWlsIjoiMTAwMDBkYXlzQHRvb2wub3JnIiwidXNlcm5hbWUiOiJUb29sIiwiaWF0IjoxNTY1MDkzMzg2LCJleHAiOjE1NjUwOTUxODZ9.tmQqglZXO6QsitGMgI8LTqaeeocmPsQs6FDyzHSnl6s"
# }
mutation signinAdmin {
	signIn(login: "öje", password: "öje") {
		token
  }
}
mutation signinUser {
  signIn(login: "user2", password: "user2"){
    token
  } 
}
# Returns token, use it as followed in HTTP-headers
# {
#  "x-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNDk2ZTBhNWVjZTQ4MWJkODBkZWViMyIsImVtYWlsIjoiMTAwMDBkYXlzQHRvb2wub3JnIiwidXNlcm5hbWUiOiJUb29sIiwiaWF0IjoxNTY1MDkzMzg2LCJleHAiOjE1NjUwOTUxODZ9.tmQqglZXO6QsitGMgI8LTqaeeocmPsQs6FDyzHSnl6s"
# }
mutation signup {
	signUp(username: "Tool" email: "10000days@tool.org" password: "Tool") {
		token
  }
}
# xxxxxxxxxxxxxxxxx
# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
# yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
# yyyyyyyyyyyyyyyyy
# Queries & mutations that DO NEED signin
query me {
  me {
    id
    username
    role
  }
}

mutation createmessage {
  createMessage(text: "Ok, nu flyger vi!!"){
    text
  }
}

mutation deletemessage {
  deleteMessage(id: "5d496f4e5ece481bd80deeb4")
}

mutation deleteUser {
  deleteUser(id:"5d496bf55ece481bd80deeaf")
}
# yyyyyyyyyyyyyyyyy
# yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
# yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

### ---


