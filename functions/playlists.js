const Playlist = require('../models/playlist.model');
const Tracks = require('../models/tracks.model');
const { createHash, comparePass } = require('../lib/helpers');

const getFullPlaylistByUserId = async (userId) => {
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

const getFullPlaylistByPlaylistId = async (playlistId) => {
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

const getPlaylistByPlaylistId = async (playlistId) => {
  try {
    return await Playlist.findById(playlistId)
  }
  catch(err) {
    throw err
  }
}

const createPlaylist = async (creatorId, title, songCount, password, accessToken) => {
  const newPassword = createHash(password);
  let uris;

  try {
    uris = await getPlaylistTracks(songCount, accessToken);
  }
  catch(err) {
    throw err
  }

  const session = await User.startSession();
  session.startTransaction();

  try {
    const opts = { session };
    const playlist = await Playlist.create(
      {
        creatorId,
        title,
        songCount,
        password: newPassword
      },
      opts
    );

    await Tracks.create(
      {
        id: playlist._id,
        creatorId,
        uris
      },
      opts
    );

    await session.commitTransaction();
    session.endSession();

    return playlist;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    throw err; 
  }
};

const verifyPlaylistPassword = async(playlistId, password) => {
  try {
    const playlist = await Playlist.findById(playlistId);

    if(new Date() <= new Date(playlist.passwordExpiration)) {
      const passwordIsCorrect = comparePass(password, playlist.password);

      return passwordIsCorrect
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
      await Playlist.updateOne(
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
  getFullPlaylistByUserId,
  getFullPlaylistByPlaylistId,
  getPlaylistByPlaylistId,
  createPlaylist,
  verifyPlaylistPassword,
  updatePassword
}