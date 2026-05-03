import gql from 'graphql-tag';

export default gql`
  extend type Query {
    allBooks(cursor: String, limit: Int): BookConnection!
    books(writerId: ID, cursor: String, limit: Int): BookConnection!
    book(bookId: ID!): Book!
  }
  
  extend type Mutation {
    createBook(
      writerIds: [ID!]!,
      title: String!,
      url: String,
      yearPublished: String,
      yearRead: String!,
      description: String,
      portraitimageurl: String
    ): Book!

    updateBook(
      id: ID!,
      writerIds: [ID!],
      title: String!,
      url: String,
      yearPublished: String,
      yearRead: String!,
      description: String,
      portraitimageurl: String,
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
    portraitimageurl: String
    createdAt: Date!
    writers: [Writer!]!
  }
`;

// extend type Subscription {
//   bookCreated: BookCreated!
// }

// type BookCreated {
//   book: Book!
// }
