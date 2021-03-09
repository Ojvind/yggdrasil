import mongoose from 'mongoose';

import User from './user';
import Writer from './writer';
import Book from './book';

const connectDb = () => {
  mongoose.set('useCreateIndex', true);
  console.log('------------------------------------');
  console.log('Connecting to Database...', process.env.DEV_DATABASE_URL);
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
