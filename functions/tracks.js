const Tracks = require('../models/tracks.model');

const saveTracks = async (playlistId, userId, uris) => {
  try{
    let tracks = await Tracks.findOne({playlistId, userId});

    if(!tracks) {
      tracks = await Tracks.create({
        playlistId,
        userId,
        uris
      });
    }

    return tracks;
  }
  catch(err) {
    throw err
  }
};


module.exports = {
  saveTracks
}