import mongoose from 'mongoose';

import User from './user';
import Writer from './writer';
import Book from './book';

const connectDb = () => {
  mongoose.set('useCreateIndex', true);
  console.log('------------------------------------');
  console.log('Connecting to Database...', process.env.TEST_DATABASE_URL);
  if (process.env.TEST_DATABASE_URL) {
    console.log('...', process.env.TEST_DATABASE_URL);
    console.log(' { useNewUrlParser: true },{ useFindAndModify: false }')
    console.log('------------------------------------');
    return mongoose.connect(
      process.env.TEST_DATABASE_URL, { 
        useNewUrlParser: true,
        // useFindAndModify: false 
      },
    );
  }

  if (process.env.DATABASE_URL) {
    console.log('...', process.env.DATABASE_URL);
    console.log(' { useNewUrlParser: true },{ useFindAndModify: false }')
    console.log('------------------------------------');
    return mongoose.connect(
      process.env.DATABASE_URL, { 
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    );
  }
};

const models = { User, Writer, Book };

export { connectDb };

export default models;
