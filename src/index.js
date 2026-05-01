import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { GraphQLError } from 'graphql';

import schema from './schema';
import resolvers from './resolvers';
import models, { connectDb } from './models';
import loaders from './loaders';
import seed from './seed';

if (!process.env.SECRET) {
  throw new Error('Missing required environment variable: SECRET');
}

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(morgan('dev'));

const getMe = async req => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new GraphQLError('Your session expired. Sign in again.', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }
  }
};

const server = new ApolloServer({
  introspection: process.env.REACT_APP_ENV === 'dev',
  typeDefs: schema,
  resolvers,
  formatError: (formattedError) => {
    const message = formattedError.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return { ...formattedError, message };
  },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const isDev = process.env.REACT_APP_ENV === 'dev';
const port = process.env.PORT || 8000;

connectDb().then(async () => {
  await server.start();

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const me = await getMe(req);

        return {
          models,
          me,
          secret: process.env.SECRET,
          loaders: {
            user: new DataLoader(keys =>
              loaders.user.batchUsers(keys, models),
            ),
            writer: new DataLoader(keys =>
              loaders.writer.batchWriters(keys, models),
            ),
          },
        };
      },
    }),
  );

  console.log('isDev', isDev);
  if (isDev) {
    console.log('------------------------------------');
    console.log('Rensar Users, Writers and Books samt skapar nya...');
    console.log('------------------------------------');
    await Promise.all([
      models.User.deleteMany({}),
      models.Writer.deleteMany({}),
      models.Book.deleteMany({}),
    ]);

    seed(models);
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

