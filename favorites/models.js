const mongoose = require('mongoose');
const uuid = require('uuid');

const favoriteSchema = mongoose.Schema({
  gameName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  }
});

const favorite = mongoose.model('favorites', favoriteSchema);

module.exports = favorite;