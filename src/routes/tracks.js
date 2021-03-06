const express = require('express');
const router = express.Router();
const { saveTracks } = require('../functions/tracks');
const { getPlaylistByPlaylistId, getFullPlaylistByPlaylistId, verifyPlaylistPassword } = require('../functions/playlists');
const { getAccessToken, getPlaylistTracks } = require('../lib/spotify');
const { loginRequired, tokenRequired, getPlaylistIdAndPassword } = require('../lib/helpers');

router.post('/', loginRequired, tokenRequired, async (req, res) => {
  const {key, userId} = req.body;

  if(!(key && userId)) {
    return res.status(422).json(`Error: Request missing data`)
  }

  try {
    const accessToken = await getAccessToken(req, res);
    const playlistDetails = getPlaylistIdAndPassword(key);

    if(!playlistDetails) {
      return res.status(422).json(`Error: Broken key.`)
    }
    
    const playlistId = playlistDetails[0];
    const password = playlistDetails[1];
    
    const playlist = await getPlaylistByPlaylistId(playlistId);

    if(!playlist) {
      throw `Error: Couldn't find playlist.`;
    }

    if(playlist.link) {
      throw `Error: Playlist has already been saved.`
    }

    const passwordIsCorrect = await verifyPlaylistPassword(playlistId, password);

    if(!passwordIsCorrect) {
      throw `Error: Incorrect Password`;
    }

    const uris = await getPlaylistTracks(playlist._id, playlist.songCount, accessToken);

    if(uris && uris.length) {
      await saveTracks(playlistId, userId, uris);

      const updatedPlaylist = await getFullPlaylistByPlaylistId(playlistId)

      res.json(updatedPlaylist);
    }
    else {
      throw `Error: Unable retrieve tracks.`;
    }
  }
  catch(err) {
    console.log(err)
    res.status(500).json(err);;
  }
});

module.exports = router;
