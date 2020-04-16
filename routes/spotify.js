const express = require('express');
const passport = require('../lib/passport');

const router = express.Router();
const {
  refreshAccessToken,
  getTopTracks,
  getSavedTracks,
  getRecommendedTracks,
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
    res.redirect('/spotify/me');
  }
);

router.get(
  '/songs',
   async (req, res) => {
    try{
      const accessToken = await refreshAccessToken(req, res);
      try {
        const longTermTracks = await getTopTracks('long_term', req.cookies.accessToken || accessToken);
        const shortTermTracks = await getTopTracks('short_term', req.cookies.accessToken || accessToken);

        res.json({long: longTermTracks.data, short: shortTermTracks.data})
      }
      catch(err) {
        res.status(500).json(`Error: ${err && err.response && err.response.data}`)
      }
    }
    catch(err) {
      res.status(500).json(`Error: ${err}`)
    }
  }
)

module.exports = router;
