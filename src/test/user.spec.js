import { expect } from 'chai';

import * as api from './api';
import models, { connectDb } from '../models';
import mongoose from 'mongoose';

let db;
let expectedUsers;
let expectedUser;
let expectedAdminUser;

before(async () => {
  db = await connectDb('mongodb://localhost:27017/testdmdmdmdm');
  expectedUsers = await models.User.find();

  expectedUser = expectedUsers.filter(
    user => user.role !== 'ADMIN',
  )[0];

  expectedAdminUser = expectedUsers.filter(
    user => user.role === 'ADMIN',
  )[0];
});

after(async () => {
  await db.connection.close();
});

describe('users', () => {
  describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult = {
        data: {
          user: {
            id: expectedUser.id,
            username: expectedUser.username,
            email: expectedUser.email,
            role: null,
          },
        },
      };

      const result = await api.user({ id: expectedUser.id });

      expect(result.data).to.eql(expectedResult);
    });

    it('returns null when user cannot be found', async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };

      const result = await api.user({
        id: new mongoose.Types.ObjectId(),
      });

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('users: [User!]', () => {
    it('returns a list of users', async () => {
      const expectedResult = {
        data: {
          users: [
            {
              id: expectedAdminUser.id,
              username: expectedAdminUser.username,
              email: expectedAdminUser.email,
              role: expectedAdminUser.role,
            },
            {
              id: expectedUser.id,
              username: expectedUser.username,
              email: expectedUser.email,
              role: null,
            },
          ],
        },
      };

      const result = await api.users();

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('me: User', () => {
    it('returns null when no user is signed in', async () => {
      const expectedResult = {
        data: {
          me: null,
        },
      };

      const { data } = await api.me();

      expect(data).to.eql(expectedResult);
    });

    it('returns me when me is signed in', async () => {
      const expectedResult = {
        data: {
          me: {
            id: expectedAdminUser.id,
            username: expectedAdminUser.username,
            email: expectedAdminUser.email,
          },
        },
      };

      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await api.signIn({
        login: 'öje',
        password: 'öje',
      });

      const { data } = await api.me(token);

      expect(data).to.eql(expectedResult);
    });
   });

  describe('signUp, updateUser, deleteUser', () => {
    it('signs up a user, updates a user and deletes the user as admin', async () => {
      // sign up

      let {
        data: {
          data: {
            signUp: { token },
          },
        },
      } = await api.signUp({
        username: 'Punkaren',
        email: 'punkaren@punk.com',
        password: 'isnotdead',
      });

      const expectedNewUser = await models.User.findByLogin(
        'punkaren@punk.com',
      );

      const {
        data: {
          data: { me },
        },
      } = await api.me(token);

      expect(me).to.eql({
        id: expectedNewUser.id,
        username: expectedNewUser.username,
        email: expectedNewUser.email,
      });

      // update as user
      const {
        data: {
          data: { updateUser },
        },
      } = await api.updateUser({ username: 'syntaren' }, token);

      expect(updateUser.username).to.eql('syntaren');

      // delete as admin
      const {
        data: {
          data: {
            signIn: { token: adminToken },
          },
        },
      } = await api.signIn({
        login: 'öje',
        password: 'öje',
      });

      const {
        data: {
          data: { deleteUser },
        },
      } = await api.deleteUser({ id: me.id }, adminToken);

      expect(deleteUser).to.eql(true);
    });
  });

  describe('deleteUser(id: String!): Boolean!', () => {
    it('returns an error because only admins can delete a user', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await api.signIn({
        login: 'user2',
        password: 'user2',
      });

      const {
        data: { errors },
      } = await api.deleteUser({ id: expectedAdminUser.id }, token);

      expect(errors[0].message).to.eql('Not authorized as admin.');
    });
  });

  describe('updateUser(username: String!): User!', () => {
    it('returns an error because only authenticated users can update a user', async () => {
      const {
        data: { errors },
      } = await api.updateUser({ username: 'Whatever' });

      expect(errors[0].message).to.eql('Not authenticated as user.');
    });
  });

  describe('signIn(login: String!, password: String!): Token!', () => {
    it('returns a token when a user signs in with username', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await api.signIn({
        login: 'öje',
        password: 'öje',
      });

      expect(token).to.be.a('string');
    });

    it('returns a token when a user signs in with email', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await api.signIn({
        login: 'ojvind.otterbjork@icloud.com',
        password: 'öje',
      });

      expect(token).to.be.a('string');
    });

    it('returns an error when a user provides a wrong password', async () => {
      const {
        data: { errors },
      } = await api.signIn({
        login: 'user2',
        password: 'user3',
      });

      expect(errors[0].message).to.eql('Invalid password.');
    });
  });

  it('returns an error when a user is not found', async () => {
    const {
      data: { errors },
    } = await api.signIn({
      login: 'dontknow',
      password: 'thisine',
    });

    expect(errors[0].message).to.eql(
      'No user found with this login credentials.',
    );
  });
});
