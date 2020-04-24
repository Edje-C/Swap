const express = require('express');
const router = express.Router();
const { tokenRequired, loginRequired } = require('../lib/helpers');
const {
  getFullPlaylistByUserId,
  getFullPlaylistByPlaylistId,
  createPlaylist,
  verifyPlaylistPassword,
  updatePassword
} = require('../functions/playlists');
const {
  getAccessToken
} = require('../lib/spotify');

router.get('/', tokenRequired, loginRequired, async (req, res) => {
  const { userId } = req.query;

  if(!userId) {
    res.status(422).json(`Error: Request should include user id.`)
  }

  try {
    const playlists = await getFullPlaylistByUserId(userId);
    res.json(playlists);
  }
  catch(err) {
    res.status(500).json(err)
  }
});

router.get('/:id', tokenRequired, loginRequired, async (req, res) => {
  try {
    const playlist = await getFullPlaylistByPlaylistId(req.params.id);

    res.json(playlist);
  }
  catch(err) {
    res.status(500).json(err)
  }
});

router.post('/update-password', tokenRequired, loginRequired, async (req, res) => {
  const {playlistId, password} = req.body;

  if(!(playlistId && password)) {
    return res.status(422).json(`Error: Request missing data.`);
  }

  try {
    const updatedPassword = await updatePassword(playlistId, password);

    res.json(updatedPassword)
  }
  catch(err) {
    res.status(500).json(err)
  }
})

router.post('/', tokenRequired, loginRequired, async (req, res) => {
  const {userId, title, songCount, password} = req.body;

  if(!(userId && title && songCount && password)) {
    return res.son(status(422).j`Error: Request missing data.`);
  }

  try {
    const accessToken = await getAccessToken(req, res);

    const newPlaylist = await createPlaylist(userId, title, songCount, password, accessToken);
    
    const fullPlaylist = await getFullPlaylistByPlaylistId(newPlaylist._id)

    res.json(fullPlaylist);
  }
  catch(err) {
    res.status(500).json(err)
  }
});

module.exports = router;
