const express = require('express');
const passport = require('../lib/passport');

const router = express.Router();
const {
  refreshAccessToken,
  getPlaylistTracks
} = require('../lib/spotify');
const SPOTIFY_API = 'https://api.spotify.com/v1';

router.get('/', (req, res) => {
  res.send('nice')
});

router.get(
  '/auth',
  passport.authenticate('spotify', {
    scope: [
      'user-read-private', 
      'user-read-email', 
      'user-library-read', 
      'user-top-read', 
      'playlist-modify-private', 
      'playlist-modify-public', 
      'playlist-read-collaborative'
    ],
    showDialog: true
  })
);

router.get(
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.session.passport.user;
    res.cookie('accessToken', user.accessToken, { expires: new Date(Date.now() + (user.expiresIn * 1000)) });
    res.cookie('refreshToken', user.refreshToken);
    res.redirect('/spotify/songs?songCount=10');
  }
);

router.get(
  '/songs',
   async (req, res) => {
    const { songCount } = req.query;

    if(!songCount) {
      res.status(422).json(`Error: Request missing data.`);
    }

    try{
      const accessToken = await refreshAccessToken(req, res);
      const tracks = await getPlaylistTracks(songCount, req.cookies.accessToken || accessToken);

      res.json(tracks)
    }
    catch(err) {
      res.status(500).json(`Error: ${err}`)
    }
  }
)

module.exports = router;
