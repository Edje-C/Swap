const express = require('express');
const router = express.Router();
const {
  getPlaylistByUserId,
  getPlaylistByPlaylistId,
  createPlaylist
} = require('../functions/playlists');

router.get('/', async (req, res) => {
  const { userId } = req.query;

  if(!userId) {
    res.status(422).json(`Error: Request should include user id.`)
  }

  try {
    const playlists = await getPlaylistByUserId(userId);
    res.json(playlists);
  }
  catch(err) {
    res.status(500).json(`Error: ${err}`)
  }
});

router.get('/:id', async (req, res) => {
  try {
    const playlist = await getPlaylistByPlaylistId(req.params.id);
    res.json(playlist);
  }
  catch(err) {
    res.status(500).json(`Error: ${err}`)
  }
});

router.post('/', async (req, res) => {
  let {creatorId, title, songCount, link, spotifyId, password} = req.body;

  if(!(creatorId && title && songCount && link && spotifyId && password)) {
    res.status(422).json(`Error: Request missing data.`);
  }

  try {
    const playlist = await createPlaylist(creatorId, title, songCount, link, spotifyId, password);
    res.json(playlist);
  }
  catch(err) {
    res.status(500).json(`Error: ${err}`)
  }
});

module.exports = router;
