const Playlist = require('../models/playlist.model');
const { createHash, comparePass } = require('../lib/helpers');

const getPlaylistByUserId = async (userId) => {
  return await Playlist.find({userId: userId});
};

const getPlaylistByPlaylistId = async (id) => {
  try{
    return await Playlist.aggregate([
      {
        $lookup: {
          from: 'collaborations',
          localField: '_id',
          foreignField: 'playlistId',
          as: 'collaborations'
        }
      },
      {
        $match: {
          '_id': id
        }  
      },
    ])
  }
  catch(err) {
    throw err
  }
};

const createPlaylist = async (creatorId, title, songCount, spotifyPlaylistId, link, password) => {
  const newPassword = createHash(password);
  try {
    return await Playlist.create({
      creatorId,
      title,
      songCount,
      link,
      spotifyPlaylistId,
      password: newPassword
    })
  }
  catch(err) {
    throw err
  }
};

const verifyPlaylistPassword = async(playlistId, password) => {
  try {
    const playlist = await Playlist.findById(playlistId);

    if(new Date() <= new Date(playlist.passwordExpiration)) {
      return comparePass(password, playlist.password);
    }
    else {
      throw 'Error: Password has expired'
    }
  }
  catch(err) {
    throw err
  }
}

module.exports = {
  getPlaylistByUserId,
  getPlaylistByPlaylistId,
  createPlaylist,
  verifyPlaylistPassword
}