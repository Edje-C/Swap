const express = require('express');
const router = express.Router();
const { saveTracks } = require('../functions/tracks');
const { getPlaylistByPlaylistId } = require('../functions/playlists');
const { getPlaylistTracks } = require('../lib/spotify');
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

    const uris = getPlaylistTracks(playlist.songCount, accessToken);

    if(uris && uris.length) {
      const collaboration = await saveTracks(playlistId, userId, uris);
      res.json(collaboration);
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
