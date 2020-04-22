const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const userRouter = require('./routes/users');
const playlistRouter = require('./routes/playlists');
const trackRouter = require('./routes/tracks');
const spotifyRouter = require('./routes/spotify');

const app = express();
const uri = process.env.ATLAS_URI;
const connection = mongoose.connection;

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "\x02\xf3\xf7r\t\x9f\xee\xbbu\xb1\xe1\x90\xfe'\xab\xa6L6\xdd\x8d[\xccO\xfe",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/spotify', spotifyRouter);
app.use('/api/users', userRouter);
app.use('/api/playlists', playlistRouter);
app.use('/api/tracks', trackRouter);

app.post('/api', (req, res) => {
  const { apiToken } = req.body;

  res.cookie('apiToken', apiToken);

  res.status(200).json('success');
})

app.use('/', express.static(path.join(__dirname, 'client/build'))).use(cors());
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
});

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log('MongoDB connection success');
})

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
