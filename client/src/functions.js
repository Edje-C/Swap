import axios from 'axios';
import uuid from 'uuid';


export const generateApiToken = () => {
  return uuid.v4();
}

export const saveApiToken = async (apiToken) => {
  await axios({
    method: 'post',
    url: '/api',
    data: {
      apiToken
    }
  })
}

export const parseCookies = () => {
  const cookies = {};
  const cookieStrings =  document.cookie && document.cookie.split(';');

  if(!cookieStrings) {
    return cookies
  }

  cookieStrings.forEach(cookieString => {
    const cookieProperties = cookieString.split('=');
    const key = cookieProperties[0].trim();
    const value = cookieProperties[1].trim()

    cookies[key] = value;
  });

  return cookies
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