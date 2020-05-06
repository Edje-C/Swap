const express = require('express');
const router = express.Router();
const { loginRequired } = require('../lib/helpers');

router.get('/', loginRequired, async (req, res) => {
  try {
    const { userId, spotifyId, displayName, apiToken } = req.user;

    res.json({
      userId,
      spotifyId,
      displayName,
      apiToken
    });
  }
  catch(err) {
    console.log(err)
    res.status(500).json(err);
  }
});

module.exports = router;
