const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [{ userId: String, grade: Number }], // rating is a table of objects 
  averageRating: { type: Number,
    get: function (v) {
        return Math.round(v * 10) / 10;
    },
    required: true
}
});


module.exports = mongoose.model('Book', bookSchema);