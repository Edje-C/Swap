const User = require('../models/user.model');

const getUserById = async (spotifyId) => {
  return await User.findOne({spotifyId});
};


module.exports = {
  getUserById
}