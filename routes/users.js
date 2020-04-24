const express = require('express');
const router = express.Router();
const { getUserById } = require('../functions/users');
const { tokenRequired, loginRequired } = require('../lib/helpers');

router.get('/', tokenRequired, loginRequired, async (req, res) => {
  try {
    const { userId, spotifyId, displayName } = req.user;

    if(userId, spotifyId, displayName) {
      res.json({
        userId,
        spotifyId,
        displayName
      });
    }
    else {
      res.status(500).json(`Error: no user found`)
    }
  }
  catch(err) {
    res.status(500).json(err)
  }
});

router.get('/:id', tokenRequired, loginRequired, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  }
  catch(err) {
    res.status(500).json(err)
  }
});

module.exports = router;
