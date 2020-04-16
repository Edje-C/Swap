const bcrypt = require('bcryptjs');

const comparePass = (inputPassword, truePassword) => {
  return bcrypt.compareSync(inputPassword, truePassword);
}

const createHash = (password) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

module.exports = {
  comparePass,
  createHash
}