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

UserSchema.methods.apiRepr = function() {
  return {
    username: this.username || '',
    password: this.hashPassword ||
  };
}

UserSchema.methods.validatePassword = function (password) {
    return bcrypt
        .compare(password, this.password)
        .then(isValid => isValid);
}

UserSchema.statics.hashPassword = function (password) {
    return bcrypt
        .hash(password, 10)
        .then(hash => hash);
}

const User = mongoose.model('users', UserSchema);

module.exports = User;