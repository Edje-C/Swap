const bcrypt = require('bcryptjs');

const comparePass = (inputPassword, truePassword) => {
  return bcrypt.compareSync(inputPassword, truePassword);
}

const createHash = (password) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return hash;
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
  addUniqueTrack,
  spliceRandomIndex,
  getRandomIndices
}