
const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  gameId: {
    type: String,
    required: true
  },
});


const favorite = mongoose.model('favorites', favoriteSchema);

module.exports = favorite;