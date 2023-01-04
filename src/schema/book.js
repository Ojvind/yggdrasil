import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    books(writerId: ID, cursor: String, limit: Int): BookConnection!
    book(bookId: ID!): Book!
  }
  
  extend type Mutation {
    createBook(
      writerId: ID!,
      title: String!,
      url: String,
      yearPublished: String,
      yearRead: String!,
      description: String,
    ): Book!

    updateBook(
      id: ID!,
      title: String!,
      url: String,
      yearPublished: String,
      yearRead: String!,
      description: String,
    ): Book!

    deleteBook(
      id: ID!
    ): Boolean
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
    url: String
    yearPublished: String
    yearRead: String!
    description: String
    createdAt: Date!
    writer: Writer!
  }
`;

// extend type Subscription {
//   bookCreated: BookCreated!
// }

// type BookCreated {
//   book: Book!
// }
