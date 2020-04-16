const Playlist = require('../models/playlist.model');
const { createHash } = require('../lib/helpers');

const getPlaylistByUserId = async (userId) => {
  return await Playlist.find({userId: userId});
};

const getPlaylistByPlaylistId = async (id) => {
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
};

const createPlaylist = async (creatorId, title, songCount, link, spotifyId, password) => {
  const newPassword = createHash(password);

  return await Playlist.create({
    creatorId,
    title,
    songCount,
    link,
    spotifyId,
    password: newPassword
  })
};

module.exports = {
  getPlaylistByUserId,
  getPlaylistByPlaylistId,
  createPlaylist
}