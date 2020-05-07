const Playlist = require('../models/playlist.model');
const Tracks = require('../models/tracks.model');
const { createHash, comparePass } = require('../lib/helpers');
const { getPlaylistTracks } = require('../lib/spotify');

const getFullPlaylistByUserId = async (userId) => {
  try {
    return await Tracks.aggregate([
      {
        $lookup: {
          from: 'playlists',
          localField: 'playlistId',
          foreignField: '_id',
          as: 'playlist'
        }
      },
      {
        $unwind: '$playlist'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'playlist.creatorId',
          foreignField: '_id',
          as: 'creator'
        }
      },
      {
        $unwind: '$creator'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'collaborator'
        }
      },
      {
        $unwind: '$collaborator'
      },
      {
        $group: {
          _id: '$playlistId',
          collaborators: {
            $push: '$collaborator'
          },
          creator: {$first: '$creator'},
          creatorId: {$first: '$playlist.creatorId'},
          title: {$first: '$playlist.title'},
          songCount: {$first: '$playlist.songCount'},
          link: {$first: '$playlist.link'},
          password: {$first: '$playlist.password'},
          passwordExpiration: {$first: '$playlist.passwordExpiration'},
          createdAt: {$first: '$playlist.createdAt'},
          updatedAt: {$first: '$playlist.updatedAt'},
          updatedAt: {$first: '$playlist.updatedAt'},
        }
      },
      {
        $match: {
          collaborators: {
            $elemMatch: {
              _id: userId
            }
          }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);
  }
  catch(err) {
    throw err
  }
};

const getFullPlaylistByPlaylistId = async (playlistId) => {
  try{
    const playlist = await Playlist.aggregate([
      {
        $match: {
          _id: playlistId
        }
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
        $unwind: '$creator'
      },
      {
        $lookup: {
          from: 'tracks',
          localField: '_id',
          foreignField: 'playlistId',
          as: 'tracks'
        }
      },
      {
        $unwind: '$tracks'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'tracks.userId',
          foreignField: '_id',
          as: 'collaborator'
        }
      },
      {
        $unwind: '$collaborator'
      },
      {
        $group: {
          _id: '$_id',
          collaborators: {
            $push: '$collaborator'
          },
          creator: {$first: '$creator'},
          creatorId: {$first: '$creatorId'},
          title: {$first: '$title'},
          songCount: {$first: '$songCount'},
          link: {$first: '$link'},
          password: {$first: '$password'},
          passwordExpiration: {$first: '$passwordExpiration'},
          createdAt: {$first: '$createdAt'},
          updatedAt: {$first: '$updatedAt'},
          updatedAt: {$first: '$updatedAt'},
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);

    return playlist[0];
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
    uris = await getPlaylistTracks(undefined, songCount, accessToken);

    if(!(uris && uris.length)) {
      throw `Error: Unable to retrieve tracks`;
    }
  }
  catch(err) {
    throw err
  }

  const session = await Playlist.startSession();
  session.startTransaction();

  try {
    const opts = { session };
    const createdPlaylist = await Playlist.create(
      [{
        creatorId,
        title,
        songCount,
        password: newPassword
      }],
      opts
    );

    const playlist = createdPlaylist[0];

    await Tracks.create(
      [{
        playlistId: playlist._id,
        userId: creatorId,
        uris
      }],
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

const savePlaylistLink = async (playlistId, link) => {
  try {
    const playlist = await Playlist.findById(playlistId);

    if(playlist) {
      await Playlist.updateOne(
        {_id: playlistId},
        {
          $set: {
            link,
            $passwordExpiration: new Date()
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
  updatePassword,
  savePlaylistLink
}