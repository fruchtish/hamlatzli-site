const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  hebrewName: {
    type: String,
    required: true,
    unique: true
  },
  iconUrl: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Category', CategorySchema);
