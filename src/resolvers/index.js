import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import writerResolvers from './writer';
import bookResolvers from './book';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [customScalarResolver, userResolvers, writerResolvers, bookResolvers];