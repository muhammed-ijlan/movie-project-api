var express = require('express');
const Movie = require('../models/Movie');
const User = require('../models/User');
const verify = require('../verifyToken');
var router = express.Router();

/* GET users listing. */
router.get('/:id', verify, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json("user not found")

    res.status(200).json(user)

  } catch (e) {
    res.status(500).json({ error: e.message })
  }
});

// Get list of movies
router.get("/movies/list", verify, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
    const favMovies = user.movieList;
    console.log(favMovies);

    const list = await Promise.all(favMovies.map(movieId => {
      return Movie.findById(movieId)
    }))
    res.status(200).json(list.flat())

  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message })
  }

})

module.exports = router;
