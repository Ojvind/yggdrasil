import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from './authorization';

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    allBooks: combineResolvers(
      isAuthenticated,
      async (_parent, {cursor, limit = 100 }, { models }) => {
        const cursorOptions = cursor
          ? {
              createdAt: {
                $lt: fromCursorHash(cursor),
              },
            }
          : {};
        const books = await models.Book.find(
          cursorOptions,
          null,
          {
            sort: { createdAt: -1 },
            limit: limit + 1,
          },
        );

        const zeroBooks = books.length === 0;
        const hasNextPage = books.length > limit;
        const edges = hasNextPage ? books.slice(0, -1) : books;

        if (zeroBooks) {
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
    books: combineResolvers(
      isAuthenticated,
      async (_parent, { writerId, cursor, limit = 100 }, { models }) => {
        const cursorOptions = cursor
          ? {
              createdAt: {
                $lt: fromCursorHash(cursor),
              },
            }
          : {};
        const filterOnWriter = writerId
          ? {
              ...cursorOptions,
              writerId: writerId.toObjectId(),
            }
          : {
            ...cursorOptions
          };
        const books = await models.Book.find(
          filterOnWriter,
          null,
          {
            sort: { createdAt: -1 },
            limit: limit + 1,
          },
        );

        const zeroBooks = books.length === 0;
        const hasNextPage = books.length > limit;
        const edges = hasNextPage ? books.slice(0, -1) : books;

        if (zeroBooks) {
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
    book: combineResolvers(
      isAuthenticated,
      async (_parent, { bookId }, { models }) => {
        return await models.Book.findById(bookId);
      },
    ),
  },

  Mutation: {
    createBook: combineResolvers(
      isAuthenticated,
      async (_parent, {writerId, title, url, yearPublished, yearRead, description, portraitimageurl}, { models }) => {
        const book = await models.Book.create({
          writerId,
          title,
          url,
          yearPublished,
          yearRead,
          description,
          portraitimageurl,
        });

        return book;
      },
    ),

    updateBook: combineResolvers(
      isAuthenticated,
      async (_parent, {id, title, url, yearPublished, yearRead, description, portraitimageurl}, { models }) => {
        let props = {
          title,
          url,
          yearPublished,
          yearRead,
          description,
          portraitimageurl,
        };
        return await models.Book.findByIdAndUpdate(
          id,
          props,
          {
            new: true,
            runValidators: true,
          },
        );
      },
    ),

    deleteBook: combineResolvers(
      isAdmin,
      async (_parent, { id }, { models }) => {
        const book = await models.Book.findById(id);

        if (book) {
          await book.deleteOne();
          return true;
        } else {
          return false;
        }
      },
    ),
  },

  Book: {
    writer: async (book, _args, { loaders }) => {
      return await loaders.writer.load(book.writerId);
    },
  },
};
