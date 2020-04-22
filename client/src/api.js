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
      url: '/api/users/alittleify',
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

export const getPlaylists = async () => {
  try {
    const {apiToken} = parseCookies();
    
    const playlists =  await axios({
      method: 'get',
      url: '/api/playlists',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
      params: {
        userId: '61086c4a-ee94-4314-8315-db1e8638d7e7'
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
    
    const playlists = await axios({
      method: 'post',
      url: '/api/playlists/updatePassword',
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