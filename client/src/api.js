import axios from 'axios';
import { parseCookies, generatePassword } from './functions';

export const saveApiToken = async (apiToken) => {
  await axios({
    method: 'post',
    url: '/api',
    data: {
      apiToken
    }
  })
}

export const getUser = async () => {
  try {
    const {apiToken} = parseCookies();
    
    const user =  await axios({
      method: 'get',
      url: '/api/users/',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
    })

    return user.data
  }
  catch(err) {
    throw err
  }
}

export const getPlaylists = async (userId) => {
  try {
    const {apiToken} = parseCookies();
    
    const playlists =  await axios({
      method: 'get',
      url: '/api/playlists',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
      params: {
        userId
      }
    })

    return playlists.data
  }
  catch(err) {
    throw err
  }
}

export const getPlaylist = async (id) => {
  try {
    const {apiToken} = parseCookies();
    
    const playlists =  await axios({
      method: 'get',
      url: `/api/playlists/${id}`,
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    })

    return playlists.data
  }
  catch(err) {
    throw err
  }
}

export const updatePassword = async (playlistId) => {
  try {
    const {apiToken} = parseCookies();
    const password = generatePassword();
    
    await axios({
      method: 'post',
      url: '/api/playlists/update-password',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
      data: {
        playlistId,
        password
      }
    })

    return password
  }
  catch(err) {
    throw err
  }
}

export const verifyPassword = async (playlistId, password) => {
  try {
    const {apiToken} = parseCookies();
    
    const passwordIsCorrect = await axios({
      method: 'post',
      url: '/api/playlists/verify-password',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
      data: {
        playlistId,
        password
      }
    });

    return passwordIsCorrect
  }
  catch(err) {
    throw err
  }
}

export const createPlaylist = async (userId, title, songCount, password) => {
  try {
    const {apiToken} = parseCookies();
    
    const playlist = await axios({
      method: 'post',
      url: '/api/playlists',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
      data: {
        userId,
        title,
        songCount,
        password
      }
    });

    return playlist.data
  }
  catch(err) {
    throw err
  }
}

export const saveTracks = async (key, userId) => {
  try {
    const {apiToken} = parseCookies();
    
    const playlist = await axios({
      method: 'post',
      url: '/api/tracks',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
      data: {
        key,
        userId
      }
    })

    return playlist.data
  }
  catch(err) {
    throw err
  }
}

export const savePlaylist = async (spotifyId, playlistId) => {
  try {
    const {apiToken} = parseCookies();
    
    const playlist = await axios({
      method: 'post',
      url: '/api/playlists/save',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
      data: {
        spotifyId,
        playlistId
      }
    })

    return playlist.data
  }
  catch(err) {
    throw err
  }
}