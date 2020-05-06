const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { tokenRequired, loginRequired } = require('../lib/helpers');
const {
  getPlaylistByPlaylistId,
  getFullPlaylistByUserId,
  getFullPlaylistByPlaylistId,
  createPlaylist,
  updatePassword,
  savePlaylistLink
} = require('../functions/playlists');
const {
  getTracksByPlaylistId
} = require('../functions/tracks');
const {
  getAccessToken,
  createPlaylistForUser,
  addSongsToPlaylist
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
    console.log(err)
    res.status(500).json(err);
  }
});

router.get('/:id', tokenRequired, loginRequired, async (req, res) => {
  try {
    const playlist = await getFullPlaylistByPlaylistId(req.params.id);

    res.json(playlist);
  }
  catch(err) {
    console.log(err)
    res.status(500).json(err);
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
    console.log(err)
    res.status(500).json(err);
  }
})

router.post('/', tokenRequired, loginRequired, async (req, res) => {
  const {userId, title, songCount, password} = req.body;

  if(!(userId && title && songCount && password)) {
    return res.status(422).json(`Error: Request missing data.`);
  }

  try {
    const accessToken = await getAccessToken(req, res);
    const newPlaylist = await createPlaylist(userId, title, songCount, password, accessToken);
    const fullPlaylist = await getFullPlaylistByPlaylistId(newPlaylist._id)

    res.json(fullPlaylist);
  }
  catch(err) {
    console.log(err)
    res.status(500).json(err);
  }
});

router.post('/save', tokenRequired, loginRequired, async (req, res) => {
  const {spotifyId, playlistId} = req.body;

  if(!(spotifyId && playlistId)) {
    return res.status(422).json(`Error: Request missing data.`);
  }

  try {
    const accessToken = await getAccessToken(req, res);
    const playlist = await getPlaylistByPlaylistId(playlistId);
    if(!playlist) {
      throw `Error: Couldn't find playlist`;
    }

    const tracks = await getTracksByPlaylistId(playlist._id);

    if(!(tracks && tracks.length)) {
      throw `Error: Couldn't retrieve tracks`;
    }

    const spotifyPlaylistResponse = await createPlaylistForUser(spotifyId, playlist.title, accessToken);
    const spotifyPlaylist = spotifyPlaylistResponse.data;
    const shuffledTracks = _.shuffle(tracks);


    await addSongsToPlaylist(spotifyPlaylist.id, shuffledTracks, accessToken);
    await savePlaylistLink(playlist._id, spotifyPlaylist.external_urls.spotify);

    const fullPlaylist = await getFullPlaylistByPlaylistId(playlist._id);

    res.json(fullPlaylist);
  }
  catch(err) {
    console.log(err)
    res.status(500).json(err);;
  }
});

module.exports = router;
