import createError from 'http-errors';
import express from 'express';
import path from 'path';
import compression from "compression";
import logger from 'morgan';
import session from 'express-session';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ServerStyleSheet } from 'styled-components'

require('dotenv').config();

import userRouter from './routes/users';
import playlistRouter from './routes/playlists';
import trackRouter from './routes/tracks';
import spotifyRouter from './routes/spotify';

import html from './html';
import App from './client/App'

const app = express();
const uri = process.env.ATLAS_URI;
const connection = mongoose.connection;

app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: "\x02\xf3\xf7r\t\x9f\xee\xbbu\xb1\xe1\x90\xfe'\xab\xa6L6\xdd\x8d[\xccO\xfe",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRouter);
app.use('/api/playlists', playlistRouter);
app.use('/api/tracks', trackRouter);
app.use('/api/spotify', spotifyRouter);

app.post('/api', (req, res) => {
  try {
    const { apiToken } = req.body;
    req.user['apiToken'] = apiToken;
  
    res.status(200).json('success');
  }
  catch(err) {
    console.log(err)
    res.status(500).json(err);
  }
});

app.use('/', express.static(path.join(__dirname)));
app.get('/*', (req, res) => {
  try {
    const sheet = new ServerStyleSheet()
    const appMarkup = ReactDOMServer.renderToString(sheet.collectStyles(
      <StaticRouter location={req.url} context={{}}>
        <App />
      </StaticRouter>
    ));
    const styleTags = sheet.getStyleTags();
    sheet.seal();

    res.send(html(
      appMarkup,
      styleTags
    ))
  }
  catch(err) {
    console.log(err)
  }
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send(err);
});

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
});
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log('MongoDB connection success');
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));

export default app;
