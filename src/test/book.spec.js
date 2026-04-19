import { expect } from 'chai';

import * as api from './api';

let testWriterId;

before(async () => {
  const {
    data: {
      data: { createWriter },
    },
  } = await api.createWriter({
    name: 'Book',
    surname: 'Tester',
    homepage: 'https://booktester.com',
    nationality: 'SE',
  });

  testWriterId = createWriter.id;
});

after(async () => {
  await api.deleteWriter({ id: testWriterId });
});

describe('books', () => {
  describe('book(bookId: ID!): Book!', () => {
    it('returns a book when book can be found', async () => {
      const {
        data: {
          data: { createBook: created },
        },
      } = await api.createBook({
        writerId: testWriterId,
        title: 'The Findable Book',
        yearRead: '2022',
        yearPublished: '2020',
      });

      const result = await api.book({ bookId: created.id });

      expect(result.data.data.book).to.eql({
        id: created.id,
        title: 'The Findable Book',
        yearRead: '2022',
        yearPublished: '2020',
      });

      await api.deleteBook({ id: created.id });
    });
  });

  describe('allBooks: BookConnection!', () => {
    it('returns a list of all books', async () => {
      const result = await api.allBooks();

      const { edges, pageInfo } = result.data.data.allBooks;

      expect(edges).to.be.an('array');
      expect(pageInfo).to.have.keys('hasNextPage', 'endCursor');
    });
  });

  describe('books(writerId: ID): BookConnection!', () => {
    it('returns only books belonging to the given writer', async () => {
      const {
        data: {
          data: { createWriter: otherWriter },
        },
      } = await api.createWriter({
        name: 'Other',
        surname: 'Writer',
        homepage: 'https://otherwriter.com',
        nationality: 'NO',
      });

      await api.createBook({
        writerId: testWriterId,
        title: 'My Writer Book',
        yearRead: '2020',
      });

      await api.createBook({
        writerId: otherWriter.id,
        title: 'Other Writer Book',
        yearRead: '2021',
      });

      const result = await api.books({ writerId: testWriterId });
      const titles = result.data.data.books.edges.map(b => b.title);

      expect(titles).to.include('My Writer Book');
      expect(titles).to.not.include('Other Writer Book');

      await api.deleteWriter({ id: otherWriter.id });
    });
  });

  describe('createBook, updateBook, deleteBook', () => {
    it('creates, updates, and deletes a book', async () => {
      const {
        data: {
          data: { createBook },
        },
      } = await api.createBook({
        writerId: testWriterId,
        title: 'A New Book',
        yearRead: '2023',
        yearPublished: '2022',
      });

      expect(createBook.title).to.eql('A New Book');
      expect(createBook.yearRead).to.eql('2023');

      const {
        data: {
          data: { updateBook },
        },
      } = await api.updateBook({
        id: createBook.id,
        title: 'An Updated Book',
        yearRead: '2024',
      });

      expect(updateBook.title).to.eql('An Updated Book');
      expect(updateBook.yearRead).to.eql('2024');

      const {
        data: {
          data: { deleteBook },
        },
      } = await api.deleteBook({ id: createBook.id });

      expect(deleteBook).to.eql(true);
    });
  });
});
