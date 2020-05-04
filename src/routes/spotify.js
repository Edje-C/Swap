const express = require('express');
const passport = require('../lib/passport');

const router = express.Router();

router.get(
  '/auth',
  passport.authenticate('spotify', {
    failureRedirect: '/',
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
    res.redirect('/');
  }
);

module.exports = router;
