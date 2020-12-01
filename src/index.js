import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { connectDb } from './models';
import loaders from './loaders';

const app = express();

app.use(cors());

app.use(morgan('dev'));

const getMe = async req => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

const server = new ApolloServer({
  introspection: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
          writer: new DataLoader(keys =>
            loaders.writer.batchWriters(keys, models),
          ),
        },
      };
    }

    if (req) {
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
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 8000;

connectDb().then(async () => {
  console.log('isTest', isTest);
  console.log('isProduction', isProduction);
  console.log('port', port);
  let clean = true;
  if (clean || isTest || isProduction) {
    console.log('------------------------------------');
    console.log('Rensar Users, Writers and Books samt skapar nya...');
    console.log('------------------------------------');
    // reset database
    await Promise.all([
      models.User.deleteMany({}),
      models.Writer.deleteMany({}),
      models.Book.deleteMany({}),
    ]);

    createInitData(new Date());
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollooooooxxxoooooooo Server on http://localhost:${port}/graphql`);
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
    createdAt: date.setSeconds(date.getSeconds() + 1),
  });

  const writer2 = new models.Writer({
    name: 'Greg',
    surname: 'McKeown',
    homepage: 'https://gregmckeown.com/',
    createdAt: date.setSeconds(date.getSeconds() + 1),
  });

  const writer3 = new models.Writer({
    name: 'Lars',
    surname: 'Kepler',
    homepage: 'http://larskepler.com/',
    createdAt: date.setSeconds(date.getSeconds() + 1),
  });

  const book1 = new models.Book({
    title: 'The 4-Hour Body',
    yearPublished: '2010',
    yearRead: '2017',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    writerId: writer1.id,
  });

  const book2 = new models.Book({
    title: 'The 4-Hour Workweek',
    yearPublished: '2007',
    yearRead: '2016',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    writerId: writer1.id,
  })

  const book3 = new models.Book({
    title: 'Essentialism: The Disciplined Pursuit of Less',
    yearPublished: '2014',
    yearRead: '2019',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    writerId: writer2.id,
  });

  const book4 = new models.Book({
    title: 'LAZARUS',
    yearPublished: '2019',
    yearRead: '2019',
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