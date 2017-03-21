
const mongoose = require('mongoose');

const timeSchema = mongoose.Schema({
  gameName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  }
});

const times = {
  create: function(gameName, userName, time) {
    console.log('Adding time To Log DB');
    const item = {
      gameName: gameName,
      id: uuid.v4(),
      userName: userName,
      time: time
    };
    this.items[item.id] = item;
    return item;
   }
};

timeSchema.methods.apiRepr = function() {

  return {
    userName: this.userName,
    gameName: this.gameName,
    time: this.time
  };
}


const time = mongoose.model('logs', timeSchema);

module.exports = time;