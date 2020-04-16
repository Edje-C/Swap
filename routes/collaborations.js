const express = require('express');
const router = express.Router();
const { createCollaboration } = require('../functions/collaborations');

router.post('/', async (req, res) => {
  const {playlistId, userId} = req.body;

  if(!(playlistId && userId)) {
    return res.status(422).json(`Error: Request missing data`)
  }

  try {
    const collaboration = await createCollaboration(playlistId, userId)
    res.json(collaboration)

  }
  catch(err) {
    res.status(500).json(`Error: ${err}`)
  }
});

module.exports = router;
