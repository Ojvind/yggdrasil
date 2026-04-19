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

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(morgan('dev'));

const getMe = async req => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new GraphQLError('Your session expired. Sign in again.', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }
  }
};

const server = new ApolloServer({
  introspection: true,
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
    console.log('Rensar Useeeeeeeers, Writers and Books samt skapar nya...');
    console.log('------------------------------------');
    await Promise.all([
      models.User.deleteMany({}),
      models.Writer.deleteMany({}),
      models.Book.deleteMany({}),
    ]);

    createInitData(new Date());
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

const createInitData = async date => {
  const user1 = new models.User({
    username: 'öje',
    email: 'ojvind.otterbjork@icloud.com',
    password: 'öje',
    role: 'ADMIN',
  });

  const user2 = new models.User({
    username: 'user2',
    email: 'user2@user.se',
    password: 'user2',
  });

  const writer1 = new models.Writer({
    name: 'Tim',
    surname: 'Ferris',
    homepage: 'https://tim.blog/',
    nationality: 'US',
    createdAt: date.setSeconds(date.getSeconds() + 1),
  });

  const writer2 = new models.Writer({
    name: 'Greg',
    surname: 'McKeown',
    homepage: 'https://gregmckeown.com/',
    nationality: 'GB',
    createdAt: date.setSeconds(date.getSeconds() + 1),
  });

  const writer3 = new models.Writer({
    name: 'Lars',
    surname: 'Kepler',
    homepage: 'http://larskepler.com/',
    nationality: 'SE',
    createdAt: date.setSeconds(date.getSeconds() + 1),
  });

  const book1 = new models.Book({
    title: 'The 4-Hour Bodyyyyyyy',
    url: 'https://fourhourbody.com/',
    yearPublished: '2010',
    yearRead: '2017',
    description: 'What ever...',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    writerId: writer1.id,
  });

  const book2 = new models.Book({
    title: 'The 4-Hour Workweek',
    url: 'https://fourhourworkweek.com/',
    yearPublished: '2007',
    yearRead: '2016',
    description: 'What ever...igen!',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    writerId: writer1.id,
  });

  const book3 = new models.Book({
    title: 'Essentialism: The Disciplined Pursuit of Less',
    url: 'https://gregmckeown.com/books/essentialism/',
    yearPublished: '2014',
    yearRead: '2019',
    description: 'What ever...ännu en gång',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    writerId: writer2.id,
  });

  const book4 = new models.Book({
    title: 'LAZARUS',
    url: 'https://larskepler.com/books/lazarus/',
    yearPublished: '2019',
    yearRead: '2019',
    description: 'What ever...one last time (?)',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    writerId: writer3.id,
  });

  user1.save();
  user2.save();
  writer1.save();
  writer2.save();
  writer3.save();
  book1.save();
  book2.save();
  book3.save();
  book4.save();
};
