const Playlist = require('../models/playlist.model');
const { createHash, comparePass } = require('../lib/helpers');

const getPlaylistByUserId = async (userId) => {
  try {
    return await Playlist.aggregate([
      {
        $lookup: {
          from: 'collaborations',
          localField: '_id',
          foreignField: 'playlistId',
          as: 'collaborations'
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator'
        }
      },
      {
        $match: {
          'creatorId': userId
        }
      },
      {
        $unwind: '$creator'
      },
      {
        $addFields: {
          collaborators: {
            $size: '$collaborations'
          }
        }
      },
      {
        $unset: ['password', 'updatedAt', 'songCount', 'creatorId', 'collaborations']
      }
    ])
  }
  catch(err) {
    throw err
  }
};

const getPlaylistByPlaylistId = async (playlistId) => {
  try{
    return await Playlist.aggregate([
        {
          $lookup: {
            from: 'collaborations',
            localField: '_id',
            foreignField: 'playlistId',
            as: 'collaborations'
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'creatorId',
            foreignField: '_id',
            as: 'creator'
          }
        },
        {
          $match: {
            '_id': playlistId
          }
        },
        {
          $unwind: '$creator'
        },
        {
          $addFields: {
            collaborators: {
              $size: '$collaborations'
            }
          }
        },
        {
          $unset: ['password', 'updatedAt', 'songCount', 'creatorId', 'collaborations']
        }
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

const updatePassword = async (playlistId, password) => {
  const newPassword = createHash(password);
  try {
    const playlist = await Playlist.findById(playlistId);

    if(playlist) {
      const updatedPlaylist = await Playlist.updateOne(
        {_id: playlistId},
        {
          $set: {
            password: newPassword,
            passwordExpiration: new Date(+new Date() + 24*60*60*1000)
          }
        }
      );
  
      return playlist
    }
    else {
      throw 'Error: Playlist not found.'
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
  verifyPlaylistPassword,
  updatePassword
}