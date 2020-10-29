import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
      title: {
          type: String,
          unique: true,
          required: true,
      },
      yearPublished: {
          type: String,
          unique: false,
          required: false,
      },
      yearRead: {
          type: String,
          unique: false,
          required: true,
      },
      writerId: {
        type: mongoose.Schema.Types.ObjectId
      },
    },
    {
        timestamps: true,
    },
)

bookSchema.statics.findByTitle = async function(title) {
    let book = await this.findOne({
      title,
    });

    return book;
  };

const Book = mongoose.model('Book', bookSchema);

export default Book;
