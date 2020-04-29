const Tracks = require('../models/tracks.model');

const saveTracks = async (playlistId, userId, uris) => {
  try{
    let tracks = await Tracks.findOne({playlistId, userId});

    if(tracks) {
      throw `Error: User already joined playlist.`
    }
    else {
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

const getTracksByPlaylistId = async (playlistId) => {
  try{
    const tracks = await Tracks.aggregate([
      {
        $match: {
          playlistId
        }
      },
      {
        $unwind: '$uris'
      },
      {
        $group: {
          _id: '$playlistId',
          uris: {
            $push: '$uris'
          }
        }
      }
    ]);

    return tracks.length ? tracks[0].uris : null;
  }
  catch(err) {
    throw err
  }
};


module.exports = {
  saveTracks,
  getTracksByPlaylistId
}