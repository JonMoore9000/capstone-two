const mongoose = require('mongoose');

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

const favorites = {
  create: function(userId, userName) {
    console.log('Adding Game To Log DB');
    const item = {
      gameName: gameName,
      id: uuid.v4(),
      userName: userName
    };
    this.items[item.id] = item;
    return item;
   }
};

const favorite = mongoose.model('favorites', favoriteSchema);

module.exports = favorite;