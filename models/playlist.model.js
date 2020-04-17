const mongoose = require('mongoose');
const uuid = require('uuid');

const Schema = mongoose.Schema;

const playlistSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuid.v4
    },
    creatorId: {
      type: String,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    songCount: {
      type: Number,
      required: true
    },
    spotifyPlaylistId: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    passwordExpiration: {
      type: Date,
      default: () => new Date(+new Date() + 24*60*60*1000)
    }
  },
  {
    timestamps: true
  }
);

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;