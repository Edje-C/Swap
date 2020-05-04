const axios = require('axios');
const _ = require('lodash');
require('dotenv').config();

const {
  addUniqueTrack,
  spliceRandomIndex,
  getRandomIndices
} = require('./helpers');
const {
  getTracksByPlaylistId
} = require('../functions/tracks');

const SPOTIFY_API = 'https://api.spotify.com/v1';

const getAccessToken = async (req, res) => {
  if(!req.user) return null

  const { accessToken } = req.user;

  return accessToken;
}

const followPlaylist = async (playlistId, accessToken) => {
  try {
    return await axios({
      method: 'put',
      url: SPOTIFY_API + `/playlists/${playlistId}/followers`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        public: false
      }
    });
  }
  catch(err) {
    throw err
  }
}

const createPlaylistForUser = async (spotifyId, title, accessToken) => {
  try {
    return await axios({
      method: 'post',
      url: SPOTIFY_API + `/users/${spotifyId}/playlists`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        name: title,
        public: false,
        description: 'A Playlist Created With Swap'
      }
    });
  }
  catch(err) {
    throw err
  }
}

const addSongsToPlaylist = async (playlistId, uris, accessToken) => {
  try {
    return await axios({
      method: 'post',
      url: SPOTIFY_API + `/playlists/${playlistId}/tracks`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        uris
      }
    });
  }
  catch(err) {
    throw err
  }
}

const getTopTracks = async (timeRange, accessToken) => {
  try {
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
  catch(err) {
    throw err
  }
}

const getSavedTracks = async (offset, accessToken) => {
  try{
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
  catch(err) {
    throw err
  }
}

const getRecommendedTracks = async (tracks, accessToken) => {
  try{
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
  catch(err) {
    throw err
  } 
}

const getPlaylistTracks = async (playlistId, target, accessToken) => {
  try {
    // how many songs we want per category
    const topTarget = Math.floor(target * .4);
    const savedTarget = Math.floor(target * .4);
    const trackUriObject = {};
    
    if(playlistId) {
      const uris = await getTracksByPlaylistId(playlistId);
      uris.forEach(uri => {
        trackUriObject[uri] = true;
      })
    }

    const topLongTermResponse = await getTopTracks('long_term', accessToken);
    const topShortTermResponse = await getTopTracks('short_term', accessToken);
    const topLongTermTracks = topLongTermResponse.data;
    const topShortTermTracks = topShortTermResponse.data;
    const allTopTracks = [...topLongTermTracks.items, ...topShortTermTracks.items];
    const uniqueTopTracks = [];
    
    allTopTracks.forEach((track) => {
      addUniqueTrack(track, uniqueTopTracks, trackUriObject)
    })

    const savedTracksResponse = await getSavedTracks(0, accessToken);
    const savedTracks = savedTracksResponse.data;
    const uniqueSavedTracks = [];

    savedTracks.items.forEach((track) => {
      addUniqueTrack(track, uniqueSavedTracks, trackUriObject)
    })

    if(savedTracks.total > 50) {
      // number of calls to get all saved songs
      const batches = Math.ceil(savedTracks.total / 50);
      const offsets =  _.range(1, batches + 1);
      
      // get a random batch of saved songs
      while(
        (uniqueSavedTracks.length < savedTarget * 5) &&
        offsets.length
      ) {
        const offestIndex = spliceRandomIndex(offsets);
        const offsetSavedTracksResponse = await getSavedTracks(offestIndex * 50, accessToken);
        const offsetSavedTracks = offsetSavedTracksResponse.data;

        offsetSavedTracks.items.forEach((track) => {
          addUniqueTrack(track, uniqueSavedTracks, trackUriObject);
        })
      }
    }

    // if user doesn't have top or saved songs this app isn't for them
    if(!(uniqueTopTracks.length || uniqueSavedTracks.length)) {
      return []
    }

    // get recommendations from the category with songs
    const recommendationDataset = uniqueTopTracks.length ? uniqueTopTracks : uniqueSavedTracks;
    const savedIndices =  _.range(recommendationDataset.length);
    const recommendationSeeds = [];
    for(let i = 0; i < 5; i++) {
      const recommendationIndex = spliceRandomIndex(savedIndices);
      Number.isInteger(recommendationIndex) && 
        recommendationSeeds.push(recommendationDataset[recommendationIndex].id);
    }

    const recommendedTracksResponse = await getRecommendedTracks(recommendationSeeds.join(','), accessToken);
    const recommendedTracks = recommendedTracksResponse.data;
    const uniqueRecommendedTracks = [];

    recommendedTracks.tracks.forEach(track => {
      addUniqueTrack(track, uniqueRecommendedTracks, trackUriObject);
    })

    // get random songs from each category
    const randomTopTracks = uniqueTopTracks.length > topTarget ? 
      getRandomIndices(topTarget, uniqueTopTracks) : uniqueTopTracks;
    const randomSavedTracks = uniqueSavedTracks.length > savedTarget ? 
      getRandomIndices(savedTarget, uniqueSavedTracks) : uniqueSavedTracks;
    // get however many recommended songs needed for collaboration
    const randomRecommendedTracks = getRandomIndices(
      target - (randomTopTracks.length + randomSavedTracks.length), 
      uniqueRecommendedTracks);
    const playlistTracks = [...randomTopTracks, ...randomSavedTracks, ...randomRecommendedTracks];

    return playlistTracks.map(track => track.uri)
  }
  catch(err) {
    throw err;
  }
}

module.exports = {
  getAccessToken,
  followPlaylist,
  createPlaylistForUser, 
  addSongsToPlaylist,
  getTopTracks,
  getSavedTracks,
  getRecommendedTracks,
  getPlaylistTracks
}