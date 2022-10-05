const express = require('express');
const router = express.Router();
const User = require("../models/User")
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")

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

// SIGNIN
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) res.status(401).json({ message: "User Not found !" })

    if (await argon2.verify(user.password, req.body.password)) {

      const token = jwt.sign({
        id: user._id
      }, process.env.SECRET)

      res.status(200).json({ message: "Successfully SignedIn !", token, user })
    } else {
      res.status(401).json({ message: "Invalid Credentials!" })
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message })
  }

})

module.exports = router;
