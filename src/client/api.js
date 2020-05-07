import axios from 'axios';
import { generatePassword } from './functions';

export const logout = async () => {
  try {    
    await axios({
      method: 'post',
      url: '/api/logout'
    });
  }
  catch(err) {
    throw err
  }
}

export const getUser = async (apiToken) => {
  try {    
    const user =  await axios({
      method: 'get',
      url: '/api/users',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    })

    return user.data
  }
  catch(err) {
    throw err
  }
}

export const getPlaylists = async (apiToken) => {
  try {    
    const playlists =  await axios({
      method: 'get',
      url: '/api/playlists',
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

export const updatePassword = async (apiToken, playlistId) => {
  try {    const password = generatePassword();
    
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

export const verifyPassword = async (apiToken, playlistId, password) => {
  try {    
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

export const createPlaylist = async (apiToken, userId, title, songCount, password) => {
  try {    
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

export const saveTracks = async (apiToken, key, userId) => {
  try {    
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

export const savePlaylist = async (apiToken, spotifyId, playlistId) => {
  try {    
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