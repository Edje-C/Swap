const express = require('express');
const router = express.Router();
const { getUserById } = require('../functions/users');

router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id)
    res.json(user);
  }
  catch(err) {
    res.status(500).json(`Error: ${err}`)
  }
});

module.exports = router;
