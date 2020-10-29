import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    books(writerId: ID, cursor: String, limit: Int): BookConnection!
    book(id: ID!): Book!
  }

  extend type Mutation {
    createBook(
      title: String!,
      yearRead: String!,
      writerId: ID!,
      yearPublished: String
    ): Book!

    updateBook(
      id: ID!,
      title: String!,
      yearRead: String!,
      yearPublished: String
    ): Book!
  }

  type BookConnection {
    edges: [Book!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Book {
    id: ID!
    title: String!
    yearPublished: String
    yearRead: String!
    createdAt: Date!
    writer: Writer!
  }
`;


// extend type Mutation {
//   createBook(text: String!): Book!
//   deleteBook(id: ID!): Boolean!
// }

// extend type Subscription {
//   bookCreated: BookCreated!
// }

// type BookCreated {
//   book: Book!
// }
