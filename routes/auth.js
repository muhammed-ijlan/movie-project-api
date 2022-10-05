const express = require('express');
const router = express.Router();
const User = require("../models/User")
const argon2 = require("argon2")

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const hash = await argon2.hash(req.body)
    const newUser = new User({
      ...req.body,
      password: hash
    })
    await newUser.save();

    res.status(201).json({ message: "User has been created!", newUser })

  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message })
  }
});



module.exports = router;
