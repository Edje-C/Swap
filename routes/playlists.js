const express = require('express');
const router = express.Router();
const { tokenRequired, loginRequired } = require('../lib/helpers');
const {
  getPlaylistByUserId,
  getPlaylistByPlaylistId,
  createPlaylist,
  verifyPlaylistPassword
} = require('../functions/playlists');
const {
  getAccessToken,
  createPlaylistForUser, 
  addSongsToPlaylist,
  getPlaylistTracks
} = require('../lib/spotify');

router.get('/', tokenRequired, loginRequired, async (req, res) => {
  const { userId } = req.query;

  if(!userId) {
    res.status(422).json(`Error: Request should include user id.`)
  }

  try {
    const playlists = await getPlaylistByUserId(userId);
    res.json(playlists);
  }
  catch(err) {
    res.status(500).json(err)
  }
});

router.get('/:id', tokenRequired, loginRequired, async (req, res) => {
  try {
    const playlist = await getPlaylistByPlaylistId(req.params.id);
    res.json(playlist);
  }
  catch(err) {
    res.status(500).json(err)
  }
});


router.post('/join', tokenRequired, loginRequired, async (req, res) => {
  const {playlistId, password} = req.body;

  if(!(playlistId && password)) {
    return res.status(422).json(`Error: Request missing data.`);
  }

  try {
    const passwordMatches = await verifyPlaylistPassword(playlistId, password);

    res.json(passwordMatches)
  }
  catch(err) {
    res.status(500).json(err)
  }
})

router.post('/', tokenRequired, loginRequired, async (req, res) => {
  const {creatorId, spotifyUserId, title, songCount, password} = req.body;

  if(!(creatorId && spotifyUserId && title && songCount && password)) {
    return res.status(422).json(`Error: Request missing data.`);
  }

  try {
    const accessToken = await getAccessToken(req, res);
    const tracks = await getPlaylistTracks(songCount, req.cookies.accessToken || accessToken);

    if(tracks && tracks.length) {
      const spotifyPlaylist = await createPlaylistForUser(spotifyUserId, title, accessToken);
      const { id, external_urls } = spotifyPlaylist.data;

      if(id && external_urls) {
        addSongsToPlaylist(id, tracks, accessToken);
  
        const playlistResponse = await createPlaylist(creatorId, title, songCount, id, external_urls.spotify, password);
        const playlist = playlistResponse.data;

        res.json({
          title: playlist.title,
          link: playlist.link
        });
      }
      else {
        throw 'Error: Couldn\'t create playlist.'
      }
    }
    else {
      throw 'Error: No tracks'
    }
  }
  catch(err) {
    res.status(500).json(err)
  }
});

module.exports = router;
