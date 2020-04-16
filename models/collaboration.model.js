const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const collaborationSchema = new Schema(
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
    }
  },
  {
    timestamps: true
  }
);

const Collaboration = mongoose.model('Collaboration', collaborationSchema);

module.exports = Collaboration;