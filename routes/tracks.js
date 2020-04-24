const express = require('express');
const router = express.Router();
const { saveTracks } = require('../functions/tracks');
const { getPlaylistByPlaylistId } = require('../functions/playlists');
const { getAccessToken, getPlaylistTracks } = require('../lib/spotify');
const { tokenRequired, loginRequired } = require('../lib/helpers');

router.post('/', tokenRequired, loginRequired, async (req, res) => {
  const {playlistId, userId} = req.body;

  if(!(playlistId && userId)) {
    return res.status(422).json(`Error: Request missing data`)
  }

  try {
    const accessToken = await getAccessToken(req, res);
    const playlist = await getPlaylistByPlaylistId(playlistId);

    if(!playlist) {
      throw `Error: Couldn't find playlist.`;
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
