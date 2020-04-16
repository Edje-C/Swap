const axios = require('axios');
const _ = require('lodash');
require('dotenv').config();

const {
  addUniqueTrack,
  spliceRandomIndex,
  getRandomIndices
} = require('./helpers');

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

const getSavedTracks = async (offset, accessToken) => {
  return await axios({
    method: 'get',
    url: SPOTIFY_API + '/me/tracks',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    params: {
      limit: 50,
      offset: offset
    }
  });
}

const getRecommendedTracks = async (tracks, accessToken) => {
  return await axios({
    method: 'get',
    url: SPOTIFY_API + '/recommendations',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    params: {
      seed_tracks: tracks,
      limit: 50
    }
  });
}

const getPlaylistTracks = async (target, accessToken) => {
  try {
    const topTarget = Math.floor(target * .4);
    const savedTarget = Math.floor(target * .4);

    const topLongTermResponse = await getTopTracks('long_term', accessToken);
    const topShortTermResponse = await getTopTracks('short_term', accessToken);
    const topLongTermTracks = topLongTermResponse.data;
    const topShortTermTracks = topShortTermResponse.data;
    
    const uniqueTopTracks = _.uniqBy([...topLongTermTracks.items, ...topShortTermTracks.items], 'id');

    const trackIdObject = uniqueTopTracks.reduce((tracks, track) => {
        tracks[track.id] = true;
        return tracks;
      }, {});

    const savedTracksResponse = await getSavedTracks(0, accessToken);
    const savedTracks = savedTracksResponse.data;
    const uniqueSavedTracks = [];

    savedTracks.items.forEach(({track}) => {
      addUniqueTrack(track, uniqueSavedTracks, trackIdObject)
    })

    if(savedTracks.total > 50) {
      const batches = Math.ceil(savedTracks.total / 50);
      const offsets =  _.range(1, batches + 1);
      
      while(
        (uniqueSavedTracks.length < savedTarget * 5) &&
        offsets.length
      ) {
        const offestIndex = spliceRandomIndex(offsets);
        const offsetSavedTracksResponse = await getSavedTracks(offestIndex * 50, accessToken);
        const offsetSavedTracks = offsetSavedTracksResponse.data;

        offsetSavedTracks.items.forEach(({track}) => {
          addUniqueTrack(track, uniqueSavedTracks, trackIdObject);
        })
      }
    }

    const savedIndices =  _.range(uniqueTopTracks.length);
    const recommendationSeeds = [];
    for(let i = 0; i < 5; i++) {
      const recommendationIndex = spliceRandomIndex(savedIndices);
      recommendationSeeds.push(uniqueTopTracks[recommendationIndex].id)
    }

    const recommendedTracksResponse = await getRecommendedTracks(recommendationSeeds.join(','), accessToken);
    const recommendedTracks = recommendedTracksResponse.data;
    const uniqueRecommendedTracks = [];

    recommendedTracks.tracks.forEach(track => {
      addUniqueTrack(track, uniqueRecommendedTracks, trackIdObject);
    })

    const randomTopTracks = uniqueTopTracks.length > topTarget ? 
      getRandomIndices(topTarget, uniqueTopTracks) : uniqueTopTracks;
    const randomSavedTracks = uniqueSavedTracks.length > savedTarget ? 
      getRandomIndices(savedTarget, uniqueSavedTracks) : uniqueSavedTracks;
    const randomRecommendedTracks = getRandomIndices(
      target - (randomTopTracks.length + randomSavedTracks.length), 
      uniqueRecommendedTracks);
    const playlistTracks = _.shuffle([...randomTopTracks, ...randomSavedTracks, ...randomRecommendedTracks]);

    return playlistTracks
  }
  catch(err) {
    console.log(`Error: ${err}`);
    return []
  }
}

module.exports = {
  refreshAccessToken,
  getTopTracks,
  getSavedTracks,
  getRecommendedTracks,
  getPlaylistTracks
}