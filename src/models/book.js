import mongoose from 'mongoose';
import isURL from 'validator/lib/isURL';

const bookSchema = new mongoose.Schema({
      title: {
        type: String,
        unique: true,
        required: true,
      },
      url: {
        type: String,
        unique: false,
        required: false,
        validate: [isURL, 'No valid web address provided.'],
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
      description: {
        type: String,
        unique: false,
        required: false,
      },
      portraitimageurl: {
        type: String,
        unique: false,
        required: false,
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
