const Collaboration = require('../models/collaboration.model');

const createCollaboration = async (playlistId, userId) => {
  try{
    let collaboration = await Collaboration.findOne({
        playlistId,
        userId
      });

    if(!collaboration) {
      collaboration = await Collaboration.create({
        playlistId,
        userId
      });
    }

    return collaboration;
  }
  catch(err) {
    throw err
  }
};


module.exports = {
  createCollaboration
}