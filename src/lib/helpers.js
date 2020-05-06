const bcrypt = require('bcryptjs');

const comparePass = (inputPassword, truePassword) => {
  return bcrypt.compareSync(inputPassword, truePassword);
}

const createHash = (password) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

const loginRequired = (req, res, next) => {
  if(req.headers['sec-fetch-site'] === 'none') {
    next('route');
  }

  if(!req.user) {
    res.status(401).json(`Error: No user found.`);
  }

  const { userId, spotifyId, displayName, apiToken, accessToken } = req.user;

  if(userId && spotifyId && displayName && apiToken && accessToken) {
    next();
  }
  else {
    res.status(401).json(`Error: No user found.`);
  }
}

const tokenRequired = async (req, res, next) => {
  if(req.headers['sec-fetch-site'] === 'none') {
    next('route');
  }

  if(!req.user) {
    res.status(401).json(`Error: No user found.`);
  }

  const { apiToken } = req.user;
  const { authorization } = req.headers;
  const authorizationProperties = authorization && authorization.split('Bearer ');
  const authToken = authorizationProperties && authorizationProperties[1]

  if(authToken && apiToken && authToken === apiToken) {
    next();
  }
  else {
    res.status(401).json(`Error: Request missing API token.`);
  }
}

const getIdsFromTracks = (tracks) => {
  return tracks.map(track => track.id);
}

const addUniqueTrack = (track, array, object) => {
  if(!object[track.uri]) {
    array.push(track);
    object[track.uri] = true;
  }
}

const spliceRandomIndex = (array) => {
  const index = array.splice(Math.floor(Math.random() * array.length), 1);
  return index[0];
}

const getRandomIndices = (amount, array) => {
  const values = [];
  const newArray = [...array];
  while(values.length < amount && newArray.length > 0) {
    const randomValue = spliceRandomIndex(newArray);
    randomValue && values.push(randomValue);
  }
  return values;
}

const getPlaylistIdAndPassword = (key) => {
  const details = key && key.split(':');

  if(
    details.length === 2 &&
    typeof details[0] === 'string' &&
    typeof details[1] === 'string'
  ) {
    return details
  }
  else {
    return null
  }
}

module.exports = {
  comparePass,
  createHash,
  loginRequired,
  tokenRequired,
  getIdsFromTracks,
  addUniqueTrack,
  spliceRandomIndex,
  getRandomIndices,
  getPlaylistIdAndPassword
}