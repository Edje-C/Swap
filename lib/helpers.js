const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const comparePass = (inputPassword, truePassword) => {
  return bcrypt.compareSync(inputPassword, truePassword);
}

const createHash = (password) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

const loginRequired = (req, res, next) => {
  if(req.user) {
    next()
  }
  else {
    res.json(null)
  }
}

const tokenRequired = async (req, res, next) => {
  const { apiToken } = req.cookies;
  const { authorization } = req.headers;
  const authorizationProperties = authorization && authorization.split('Bearer ');

  if(authorizationProperties && authorizationProperties[1] === apiToken) {
    next();
  }
  else {
    next('route')
  }
}

const getIdsFromTracks = (tracks) => {
  return tracks.map(track => track.id);
}

const addUniqueTrack = (track, array, object) => {
  if(!object[track.id]) {
    array.push(track);
    object[track.id] = true;
  }
}

const spliceRandomIndex = (array) => {
  const index = array.splice(Math.floor(Math.random() * array.length), 1);
  return index[0]
}

const getRandomIndices = (amount, array) => {
  const values = [];
  const newArray = [...array];
  for(let i = 0; i < amount; i++) {
    const randomValue = spliceRandomIndex(newArray);
    randomValue && values.push(randomValue)
  }
  return values
}

module.exports = {
  comparePass,
  createHash,
  loginRequired,
  tokenRequired,
  getIdsFromTracks,
  addUniqueTrack,
  spliceRandomIndex,
  getRandomIndices
}