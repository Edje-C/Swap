const User = require('../models/user.model');

const getUserById = async (spotifyId) => {
  try {
    return await User.findOne({spotifyId});
  }
  catch(err) {
    return err
  }
};


module.exports = {
  getUserById
}