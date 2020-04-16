const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const userRouter = require('./routes/users');
const playlistRouter = require('./routes/playlists');
const collaborationRouter = require('./routes/collaborations');
const spotifyRouter = require('./routes/spotify');

const app = express();
const uri = process.env.ATLAS_URI;
const connection = mongoose.connection;

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static(path.join(__dirname, 'client/build')));
app.use('/users', userRouter);
app.use('/playlists', playlistRouter);
app.use('/collaborations', collaborationRouter);
app.use('/spotify', spotifyRouter);

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
  res.send('err');
  console.log('err', err)
});

module.exports = app;
