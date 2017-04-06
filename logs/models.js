
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

const time = mongoose.model('logs', timeSchema);

module.exports = time;