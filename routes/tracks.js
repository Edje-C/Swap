const express = require('express');
const router = express.Router();
const { saveTracks } = require('../functions/tracks');
const { getPlaylistByPlaylistId } = require('../functions/playlists');
const { getAccessToken, getPlaylistTracks } = require('../lib/spotify');
const { tokenRequired, loginRequired, getPlaylistIdAndPassword } = require('../lib/helpers');

router.post('/', tokenRequired, loginRequired, async (req, res) => {
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
    
    const playlistId = playlistIdDetails[0];
    const password = playlistIdDetails[1];
    
    const playlist = await getPlaylistByPlaylistId(playlistId);

    if(!playlist) {
      throw `Error: Couldn't find playlist.`;
    }

    const passwordIsCorrect = await verifyPlaylistPassword(playlistId, password);

    if(!passwordIsCorrect) {
      throw `Error: Incorrect Password`;
    }

    const uris = await getPlaylistTracks(playlist.songCount, accessToken);
    
    if(uris && uris.length) {
      await saveTracks(playlistId, userId, uris);
      res.json(true);
    }
    else {
      throw `Error: Couldn't collect tracks.`;
    }
  }
  catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
