const express = require('express');
const router = express.Router();
const User = require("../models/User")
const argon2 = require("argon2")
const jwt = require("jsonwebtoken");
const verify = require('../verifyToken');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    if (!email || !password || !fullname) {
      return res.status(422).json("Please fill the provided fields!")
    }

    const userExist = await User.findOne({ email: email })

    if (userExist) {
      return res.status(403).json("Email already exists")
    }

    const hash = await argon2.hash(req.body.password)
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
    if (!user) {
      return res.status(401).json({ message: "User Not found !" })
    }


    if (!req.body.password) {
      res.status(401).json("Please enter password !")

    } else if (await argon2.verify(user.password, req.body.password)) {

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

// LOGOUT
// router.get("/logout", verify, (req, res) => {
//   try {
//     console.log(req.token);
//     req.token = "";
//     req.user = null;
//     res.status(200).json("logged out")
//   } catch (e) {
//     res.status(500).json(e.message)
//   }
// })

module.exports = router;
