import { expect } from 'chai';

import * as api from './api';

const ADMIN_LOGIN = { login: 'öje', password: 'öje' };
const USER_LOGIN = { login: 'user2', password: 'user2' };

let expectedUser;
let expectedAdminUser;

before(async () => {
  const {
    data: {
      data: { users },
    },
  } = await api.users();

  expectedUser = users.filter(user => user.role !== 'ADMIN')[0];
  expectedAdminUser = users.filter(user => user.role === 'ADMIN')[0];
});

describe('users', () => {
  describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const result = await api.user({ id: expectedUser.id });

      expect(result.data.data.user).to.eql({
        id: expectedUser.id,
        username: expectedUser.username,
        email: expectedUser.email,
        role: null,
      });
    });

    it('returns null when user cannot be found', async () => {
      const result = await api.user({ id: '000000000000000000000000' });

      expect(result.data.data.user).to.be.null;
    });
  });

  describe('users: [User!]', () => {
    it('returns a list containing all seeded users', async () => {
      const result = await api.users();
      const users = result.data.data.users;
      const ids = users.map(u => u.id);

      expect(ids).to.include(expectedAdminUser.id);
      expect(ids).to.include(expectedUser.id);

      const admin = users.find(u => u.id === expectedAdminUser.id);
      expect(admin.role).to.eql('ADMIN');

      const regular = users.find(u => u.id === expectedUser.id);
      expect(regular.role).to.be.null;
    });
  });

  describe('me: User', () => {
    it('returns null when no user is signed in', async () => {
      const { data } = await api.me();

      expect(data.data.me).to.be.null;
    });

    it('returns me when me is signed in', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await api.signIn(ADMIN_LOGIN);

      const { data } = await api.me(token);

      expect(data.data.me).to.eql({
        id: expectedAdminUser.id,
        username: expectedAdminUser.username,
        email: expectedAdminUser.email,
      });
    });
  });

  describe('signUp, updateUser, deleteUser', () => {
    let newUserToken;
    let newUserId;

    before(async () => {
      const {
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

      newUserToken = token;

      const {
        data: {
          data: { me },
        },
      } = await api.me(token);

      newUserId = me.id;
    });

    after(async () => {
      if (!newUserId) return;

      const {
        data: {
          data: {
            signIn: { token: adminToken },
          },
        },
      } = await api.signIn(ADMIN_LOGIN);

      await api.deleteUser({ id: newUserId }, adminToken);
    });

    it('signs up a user', async () => {
      const {
        data: {
          data: { me },
        },
      } = await api.me(newUserToken);

      expect(me.username).to.eql('Punkaren');
      expect(me.email).to.eql('punkaren@punk.com');
    });

    it('updates the user', async () => {
      const {
        data: {
          data: { updateUser },
        },
      } = await api.updateUser({ username: 'syntaren' }, newUserToken);

      expect(updateUser.username).to.eql('syntaren');
    });

    it('deletes the user as admin', async () => {
      const {
        data: {
          data: {
            signIn: { token: adminToken },
          },
        },
      } = await api.signIn(ADMIN_LOGIN);

      const {
        data: {
          data: { deleteUser },
        },
      } = await api.deleteUser({ id: newUserId }, adminToken);

      expect(deleteUser).to.eql(true);
      newUserId = null;
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
      } = await api.signIn(USER_LOGIN);

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
      } = await api.signIn(ADMIN_LOGIN);

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
      } = await api.signIn({ login: 'user2', password: 'wrongpassword' });

      expect(errors[0].message).to.eql('Invalid password.');
    });

    it('returns an error when a user is not found', async () => {
      const {
        data: { errors },
      } = await api.signIn({ login: 'dontknow', password: 'thisine' });

      expect(errors[0].message).to.eql(
        'No user found with this login credentials.',
      );
    });
  });
});
