import mongoose from 'mongoose';

import isURL from 'validator/lib/isURL';

const writerSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: false,
      required: true,
    },
    surname: {
      type: String,
      unique: false,
      required: true,
    },
    homepage: {
      type: String,
      unique: false,
      required: false,
      validate: [isURL, 'No valid web address provided.'],
    },
  },
  {
    timestamps: true,
  },
);

writerSchema.statics.findByLogin = async function(login) {
  let writer = await this.findOne({
    name: login,
  });

  if (!writer) {
    writer = await this.findOne({ email: login });
  }

  return writer;
};

const Writer = mongoose.model('Writer', writerSchema);

export default Writer;
