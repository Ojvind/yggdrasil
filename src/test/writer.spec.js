import { expect } from 'chai';
import mongoose from 'mongoose';

import * as api from './api';

describe('writers', () => {
  describe('writer(id: ID!): Writer', () => {
    it('returns a writer when writer can be found', async () => {
      const {
        data: {
          data: { createWriter: created },
        },
      } = await api.createWriter({
        name: 'Test',
        surname: 'Author',
        homepage: 'https://example.com',
        nationality: 'SE',
      });

      const result = await api.writer({ id: created.id });

      expect(result.data.data.writer).to.eql({
        id: created.id,
        name: 'Test',
        surname: 'Author',
        homepage: 'https://example.com',
        nationality: 'SE',
      });

      await api.deleteWriter({ id: created.id });
    });

    it('returns null when writer cannot be found', async () => {
      const result = await api.writer({ id: new mongoose.Types.ObjectId() });

      expect(result.data.data.writer).to.be.null;
    });
  });

  describe('writers: WriterConnection!', () => {
    it('returns a list of writers', async () => {
      const result = await api.writers();

      const { edges, pageInfo } = result.data.data.writers;

      expect(edges).to.be.an('array');
      expect(pageInfo).to.have.keys('hasNextPage', 'endCursor');
    });
  });

  describe('createWriter, updateWriter, deleteWriter', () => {
    it('creates, updates, and deletes a writer', async () => {
      const {
        data: {
          data: { createWriter },
        },
      } = await api.createWriter({
        name: 'New',
        surname: 'Writer',
        homepage: 'https://newwriter.com',
        nationality: 'NO',
      });

      expect(createWriter.name).to.eql('New');
      expect(createWriter.surname).to.eql('Writer');
      expect(createWriter.nationality).to.eql('NO');

      const {
        data: {
          data: { updateWriter },
        },
      } = await api.updateWriter({
        id: createWriter.id,
        name: 'Updated',
        surname: 'Writer',
        homepage: 'https://newwriter.com',
        nationality: 'DK',
      });

      expect(updateWriter.name).to.eql('Updated');
      expect(updateWriter.nationality).to.eql('DK');

      const {
        data: {
          data: { deleteWriter },
        },
      } = await api.deleteWriter({ id: createWriter.id });

      expect(deleteWriter).to.eql(true);
    });
  });

  describe('deleteWriter cascade', () => {
    it('deletes all associated books when a writer is deleted', async () => {
      const {
        data: {
          data: { createWriter },
        },
      } = await api.createWriter({
        name: 'Doomed',
        surname: 'Author',
        homepage: 'https://doomed.com',
        nationality: 'US',
      });

      await api.createBook({
        writerId: createWriter.id,
        title: 'Doomed Book One',
        yearRead: '2020',
      });

      await api.createBook({
        writerId: createWriter.id,
        title: 'Doomed Book Two',
        yearRead: '2021',
      });

      const before = await api.books({ writerId: createWriter.id });
      expect(before.data.data.books.edges).to.have.length(2);

      await api.deleteWriter({ id: createWriter.id });

      const after = await api.books({ writerId: createWriter.id });
      expect(after.data.data.books.edges).to.have.length(0);
    });
  });
});
