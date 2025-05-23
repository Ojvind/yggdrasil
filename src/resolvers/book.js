import { combineResolvers } from 'graphql-resolvers';

// import pubsub, { EVENTS } from '../subscription';
// import { isAuthenticated, isBookOwner } from './authorization';

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

// Every String can be casted in ObjectId now
//console.log('545f489dea12346454ae793b'.toObjectId());

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    allBooks: async (parent, {cursor, limit = 100 }, { models }) => {
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
    books: async (parent, { writerId, cursor, limit = 100 }, { models }) => {
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
    book: async (parent, { bookId }, { models }) => {
      return await models.Book.findById(bookId);
    },
  },

  Mutation: {
    createBook: combineResolvers(
//      isAuthenticated,
      async (parent, {writerId, title, url, yearPublished, yearRead, description, portraitimageurl}, { models, me }) => {
        const book = await models.Book.create({
          writerId,
          title,
          url,
          yearPublished,
          yearRead,
          description,
          portraitimageurl,
        });

        // pubsub.publish(EVENTS.BOOK.CREATED, {
        //   bookCreated: { book },
        // });

        return book;
      },
    ),

    // db.books.update({_id : ObjectId("5dc81823bce5084ab0f5a620")},{$set:{title:"Lovlla",yearRead:"K"}})

    updateBook: combineResolvers(
//      isAuthenticated,
      async (parent, {id, title, url, yearPublished, yearRead, description, portraitimageurl,
      }, { models }) => {
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
      // isAuthenticated,
      // isBookOwner,
      async (parent, { id }, { models }) => {
        const book = await models.Book.findById(id);

        if (book) {
          await book.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },

  Book: {
    writer: async (book, args, { loaders }) => {
      return await loaders.writer.load(book.writerId);
    },
  },

  // Subscription: {
  //   bookCreated: {
  //     subscribe: () => pubsub.asyncIterator(EVENTS.BOOK.CREATED),
  //   },
  // },
};
