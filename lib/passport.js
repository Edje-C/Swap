const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const User = require('../models/user.model');
require('dotenv').config();

const { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } = process.env

passport.use(
  new SpotifyStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL
    },
    (accessToken, refreshToken, expiresIn, profile, done) => {
      const tokens = { accessToken, refreshToken, expiresIn };

      User.findOne({ spotifyId: profile.id })
        .then(user => {
          if(user) {
            return done(null, tokens);
          }
          else {
            User.create({spotifyId: profile.id, displayName: profile.displayName})
              .then(user => {
                return done(null, tokens);
              })
              .catch(err => {
                return done();
              })
          }
        })
        .catch(err => {
          return done();
        })
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport