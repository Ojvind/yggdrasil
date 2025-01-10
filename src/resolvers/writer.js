import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    writers: async (parent, {cursor, limit = 100 }, { models }) => {
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
    writer: async (parent, { id }, { models }) => {
      return await models.Writer.findById(id);
    },
  },

  Mutation: {
    createWriter: combineResolvers(
      async(parent, { name, surname, homepage, portraitimageurl, nationality }, { models }) => {
        return await models.Writer.create(
          { name, surname, homepage, portraitimageurl, nationality },
        );
      },
    ),

    updateWriter: combineResolvers(
//      isAuthenticated,
      async (parent, { id, name, surname, homepage, portraitimageurl, nationality }, { models }) => {
        let props = {};
        if (homepage && portraitimageurl && nationality) {
          props = {
            name,
            surname,
            homepage,
            portraitimageurl,
            nationality,
          }
        } else if (homepage && !portraitimageurl && !nationality) {
          props = {
            name,
            surname,
            homepage,
          }
        } else if (!homepage && portraitimageurl && !nationality) {
          props = {
            name,
            surname,
            portraitimageurl,
          }
        } else if (!homepage && !portraitimageurl && nationality) {
          props = {
            name,
            surname,
            nationality,
          }
        } else if (homepage && portraitimageurl && !nationality) {
          props = {
            name,
            surname,
            homepage,
            portraitimageurl,
          }
        } else if (homepage && !portraitimageurl && nationality) {
          props = {
            name,
            surname,
            homepage,
            nationality,
          }
        } else if (!homepage && portraitimageurl && nationality) {
          props = {
            name,
            surname,
            portraitimageurl,
            nationality,
          }
        }
      return await models.Writer.findByIdAndUpdate(
          id,
          props,
          { 
            new: true,
            runValidators: true,
          },
        );
      },
    ),

    deleteWriter: combineResolvers(
      // isAdmin,
      async (parent, { id }, { models }) => {
        const writer = await models.Writer.findById(id);
        if (writer) {
          const books = await models.Book.find({ writerId: writer.id});
          if (books) {
            for (var i = 0; i < books.length; i++) {
              await books[i].remove();
            }
          }
          await writer.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },
  Writer: {
    books: async (writer, args, { models }) => {
      return await models.Book.find({
        writerId: writer.id,
      });
    },
  },
};
