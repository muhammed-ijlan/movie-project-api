const router = require("express").Router();
const verify = require("../verifyToken")
const Movie = require("../models/Movie");
const User = require("../models/User");

// GET ALL
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const page = parseInt(req.query.page) - 1 || 0;
        const skip = limit * page
        const search = req.query.search || "";

        const movie = await Movie.find({ movieName: { $regex: search, $options: "i" } }).limit(limit).skip(skip)
        const total = await Movie.find().countDocuments().exec();

        res.status(200).json({ total, limit, skip, movie })
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
        res.status(200).json({ success: true, message: "Movie has been added to your movie list" })


    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message })
    }
})

router.put("/dislike/:id", verify, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { movieList: req.params.id }
        })
        res.status(200).json("movie successfully removed from movie list")
    } catch (er) {
        console.log(er);
    }
})

module.exports = router;