const router = require("express").Router();
const verify = require("../verifyToken")
const Movie = require("../models/Movie");
const User = require("../models/User");

// GET ALL
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit || 8;
        const page = req.query.page - 1 || 0;
        const skip = limit * page

        const movie = await Movie.find().limit(limit).skip(skip)
        res.status(200).json({ limit, skip, movie })
    } catch (e) {
        console.log(e);
        res.status(500).json(e)
    }
})

// GET A MOVIE
router.get("/:id", verify, async (req, res) => {

    try {
        const movie = await Movie.findById({ _id: req.params.id })
        if (!movie) res.status(401).json("No movie found!")
        res.status(200).json(movie)

    } catch (e) {
        res.status(500).json(e)
    }
})

// Like A MOVIE
router.put("/like/:id", verify, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { movieList: req.params.id }
        })

        res.status(201).json("Movie has been added to users Moivelist !")
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message })
    }
})

module.exports = router;