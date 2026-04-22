import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { GraphQLError } from 'graphql';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { isAdmin, isAuthenticated } from './authorization';
import { minioClient, BUCKET_NAME } from '../minio';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    users: combineResolvers(
      isAuthenticated,
      async (_parent, _args, { models }) => {
        return await models.User.find();
      },
    ),
    user: combineResolvers(
      isAuthenticated,
      async (_parent, { id }, { models }) => {
        return await models.User.findById(id);
      },
    ),
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }

      return await models.User.findById(me.id);
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '1m') };
    },

    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);

      const isValid = user && (await user.validatePassword(password));

      if (!user || !isValid) {
        throw new GraphQLError('Invalid login credentials.', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return { token: createToken(user, secret, '30m') };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, { username }, { models, me }) => {
        return await models.User.findByIdAndUpdate(
          me.id,
          { username },
          { new: true },
        );
      },
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        const user = await models.User.findById(id);

        if (user) {
          await user.deleteOne();
          return true;
        } else {
          return false;
        }
      },
    ),

    generateUploadUrl: combineResolvers(
      isAuthenticated,
      async (_parent, { filename, contentType }) => {
        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: filename,
          ContentType: contentType,
        });
        return getSignedUrl(minioClient, command, { expiresIn: 300 });
      },
    ),
  },
};
