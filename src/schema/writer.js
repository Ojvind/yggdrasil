import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    writers(cursor: String, limit: Int): WriterConnection!
    writer(id: ID!): Writer
  }

  extend type Mutation {
    createWriter(
      name: String!,
      surname: String!,
      homepage: String,
      portraitimageurl: String,
      nationality: String): Writer!
    updateWriter(
      id: ID!, 
      name: String!, 
      surname: String!, 
      homepage: String,
      portraitimageurl: String,
      nationality: String
    ): Writer!
    deleteWriter(id: ID!): Boolean!
  }
  
  type WriterConnection {
    edges: [Writer!]!
    pageInfo: PageInfo!
  }

  type Writer {
    id: ID!
    name: String!
    surname: String!
    homepage: String
    portraitimageurl: String
    nationality: String
    books: [Book!]
  }
`;
