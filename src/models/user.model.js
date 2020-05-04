const mongoose = require('mongoose');
const uuid = require('uuid');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuid.v4
    },
    spotifyId: {
      type: String,
      required: true
    },
    displayName: {
      type: String
    }
  }
);

const User = mongoose.model('User', userSchema);

User.createCollection();

module.exports = User;