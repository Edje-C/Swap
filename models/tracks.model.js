const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tracksSchema = new Schema(
  {
    playlistId: {
      type: String,
      required: true,
      ref: 'Playlist'
    },
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    uris: {
      type: [String],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Tracks = mongoose.model('Tracks', tracksSchema);

module.exports = Tracks;