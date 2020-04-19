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
    const user = req.session.passport.user;
    res.cookie('accessToken', user.accessToken, { expires: new Date(Date.now() + (user.expiresIn * 1000)) });
    res.cookie('refreshToken', user.refreshToken);
    res.redirect('/');
  }
);

module.exports = router;
