import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    writers: combineResolvers(
      isAuthenticated,
      async (_parent, {cursor, limit = 100 }, { models }) => {
        const cursorOptions = cursor
        ? {
            createdAt: {
              $lt: fromCursorHash(cursor),
            },
          }
        : {};
        const writer = await models.Writer.find(
        cursorOptions,
        null,
        {
          sort: { createdAt: -1 },
          limit: limit + 1,
        },
        );

        const zeroWriters = writer.length === 0;
        const hasNextPage = writer.length > limit;
        const edges = hasNextPage ? writer.slice(0, -1) : writer;

        if (zeroWriters) {
          return {
            edges,
            pageInfo: {
              hasNextPage,
              endCursor: ""
            }
          }
        }

        return {
          edges,
          pageInfo: {
            hasNextPage,
            endCursor: toCursorHash(
              edges[edges.length - 1].createdAt.toString(),
            ),
          },
        };
      },
    ),
    writer: combineResolvers(
      isAuthenticated,
      async (_parent, { id }, { models }) => {
        return await models.Writer.findById(id);
      },
    ),
  },

  Mutation: {
    createWriter: combineResolvers(
      isAuthenticated,
      async(_parent, { name, surname, homepage, portraitimageurl, nationality, description }, { models }) => {
        return await models.Writer.create(
          { name, surname, homepage, portraitimageurl, nationality, description },
        );
      },
    ),

    updateWriter: combineResolvers(
      isAuthenticated,
      async (_parent, { id, name, surname, homepage, portraitimageurl, nationality, description }, { models }) => {
        const props = { name, surname };
        if (homepage) props.homepage = homepage;
        if (portraitimageurl) props.portraitimageurl = portraitimageurl;
        if (nationality) props.nationality = nationality;
        if (description) props.description = description;

        return await models.Writer.findByIdAndUpdate(
          id,
          props,
          { new: true, runValidators: true },
        );
      },
    ),

    deleteWriter: combineResolvers(
      isAdmin,
      async (_parent, { id }, { models }) => {
        const writer = await models.Writer.findById(id);
        if (writer) {
          const books = await models.Book.find({ writerId: writer.id});
          if (books) {
            for (var i = 0; i < books.length; i++) {
              await books[i].deleteOne();
            }
          }
          await writer.deleteOne();
          return true;
        } else {
          return false;
        }
      },
    ),
  },
  Writer: {
    books: async (writer, _args, { models }) => {
      return await models.Book.find({
        writerId: writer.id,
      });
    },
  },
};
