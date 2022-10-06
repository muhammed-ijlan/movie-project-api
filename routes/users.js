var express = require('express');
const User = require('../models/User');
const verify = require('../verifyToken');
var router = express.Router();

/* GET users listing. */
router.get('/:id', verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) res.status(404).json("user not found")
    res.status(200).json(user)

  } catch (e) {
    res.status(500).json({ error: e.message })
  }
});

module.exports = router;
