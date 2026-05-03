/**
 * Migration: writerId -> writerIds
 *
 * For each Book that has a legacy `writerId` field, copy it into the
 * `writerIds` array and remove the old field.
 *
 * Run with: node migrate-writer-ids.js
 * (requires MONGODB_URI or DATABASE_URL env var, same as the main app)
 */

import mongoose from 'mongoose';

const MONGO_URL =
  process.env.DATABASE_URL ||
  process.env.DEV_DATABASE_URL ||
  'mongodb://localhost:27017/yggdrasil';

async function migrate() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to', MONGO_URL);

  const collection = mongoose.connection.collection('books');

  const books = await collection.find({ writerId: { $exists: true } }).toArray();
  console.log(`Found ${books.length} books with legacy writerId`);

  let updated = 0;
  for (const book of books) {
    await collection.updateOne(
      { _id: book._id },
      {
        $set: { writerIds: [book.writerId] },
        $unset: { writerId: '' },
      },
    );
    updated++;
  }

  console.log(`Updated ${updated} books`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
