import mongoose from 'mongoose';

import User from './user';
import Writer from './writer';
import Book from './book';

const connectDb = (url) => {
  const connectionUrl =
    url ||
    (process.env.REACT_APP_ENV === 'dev' && process.env.DEV_DATABASE_URL) ||
    (process.env.REACT_APP_ENV === 'production' && process.env.DATABASE_URL);

  console.log('------------------------------------');
  if (process.env.REACT_APP_ENV === 'dev') {
    console.log('Connecting to Development Database...', connectionUrl);
  } else if (process.env.REACT_APP_ENV === 'production') {
    console.log('Connecting to PRODUCTION Database...', connectionUrl);
  }
  console.log('------------------------------------');

  if (connectionUrl) {
    return mongoose.connect(connectionUrl);
  }
};

const models = { User, Writer, Book };

export { connectDb };

export default models;
