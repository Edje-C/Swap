const axios = require('axios');
require('dotenv').config();

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const SPOTIFY_API = 'https://api.spotify.com/v1';


const refreshAccessToken = async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;

  if(!refreshToken) {
    res.redirect('/spotify/auth')
  }
  else if(!accessToken) {
    try{
      const tokens = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        params: {
          'grant_type': 'refresh_token',
          'refresh_token': refreshToken
        },
        withCredentials: true,
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET
        }
      });

      const {access_token, expires_in} = tokens.data;

      res.cookie('accessToken', access_token, { expires: new Date(Date.now() + (expires_in * 1000)) });

      return access_token
    }
    catch(err) {
      res.status(500).json(err)
    }
  }
}

const getTopTracks = async (timeRange, accessToken) => {
  return await axios({
      method: 'get',
      url: SPOTIFY_API + '/me/top/tracks',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        limit: 50,
        time_range: timeRange
      }
    });
}

const getSavedTracks = () => {

}

const getRecommendedTracks = () => {

}

const getPlaylistTracks = () => {

}

module.exports = {
  refreshAccessToken,
  getTopTracks,
  getSavedTracks,
  getRecommendedTracks,
  getPlaylistTracks
}