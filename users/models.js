const mongoose = require('mongoose');
const bcrypt = require('bcryptjs') ;

// SCHEMA FOR LOGIN INFO
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
});

const User = mongoose.model('users', UserSchema);

module.exports = User;