import mongoose from 'mongoose';

import User from './user';
import Writer from './writer';
import Book from './book';

const connectDb = () => {
  mongoose.set('useCreateIndex', true);
  console.log('------------------------------------');
  if (process.env.REACT_APP_ENV === "dev") {
    console.log('Connecting to Development Database...', process.env.DEV_DATABASE_URL);
  }
  else if (process.env.REACT_APP_ENV === "production") {
    console.log('Connecting to PRODUCTION Database...', process.env.DATABASE_URL);
  }

  if (process.env.DEV_DATABASE_URL && process.env.REACT_APP_ENV === "dev") {
    return mongoose.connect(
      process.env.DEV_DATABASE_URL, { 
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    );
  }

  if (process.env.DATABASE_URL && process.env.REACT_APP_ENV === "production") {
    return mongoose.connect(
      process.env.DATABASE_URL, { 
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    );
  }
  console.log('------------------------------------');
};

const models = { User, Writer, Book };

export { connectDb };

export default models;
