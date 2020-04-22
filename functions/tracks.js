const Tracks = require('../models/tracks.model');

const saveTracks = async (playlistId, userId, uris) => {
  try{
    tracks = await Tracks.create({
      playlistId,
      userId,
      uris
    });

    return tracks;
  }
  catch(err) {
    throw err
  }
};


module.exports = {
  saveTracks
}