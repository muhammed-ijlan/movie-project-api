const router = require("express").Router();
const verify = require("../verifyToken")
const Movie = require("../models/Movie");
const User = require("../models/User");
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({ storage: storage })

// GET ALL
// router.get("/", async (req, res) => {
//     try {
//         const limit = parseInt(req.query.limit) || 8;
//         const page = parseInt(req.query.page) - 1 || 0;
//         const skip = limit * page
//         const search = req.query.search || "";

//         const movie = await Movie.find({ movieName: { $regex: search, $options: "i" } }).limit(limit).skip(skip)
//         const total = await Movie.find().countDocuments().exec();

//         res.status(200).json({ total, limit, skip, movie })
//     } catch (e) {
//         console.log(e);
//         res.status(500).json(e)
//     }
// })

// TODO: GET ALL

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 8;
    const page = parseInt(req.query.page) - 1 || 0;
    const skip = limit * page
    const search = req.query.search || "";
    try {

        const movies = await Movie.aggregate([
            {
                $facet: {
                    "docs": [
                        { $match: { "movieName": { $regex: search, $options: "i" } } },
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    "totalCount": [
                        { $count: "count" }
                    ]
                }
            }

        ])

        if (!movies) res.status(404).json("no movie found")

        res.status(200).json({ limit, skip, movies })
    } catch (e) {
        console.log(e);
        res.status(500).json(e.message)
    }
})

// GET A MOVIE
router.get("/:id", verify, async (req, res) => {

    try {
        const movie = await Movie.findById({ _id: req.params.id })
        console.log(movie);
        if (!movie) res.status(404).json({ message: "movie not found" })
        res.status(200).json(movie)

    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// ExPORT

// Like A MOVIE
router.put("/like/:id", verify, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
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
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { movieList: req.params.id }
        })
        res.status(200).json("movie successfully removed from movie list")
    } catch (er) {
        console.log(er);
    }
})

// create Movie
router.post("/create", upload.single("movie"), verify, async (req, res) => {
    try {
        const newMovie = new Movie({
            movieName: req.body.movieName,
            image: req.file.path,
            desc: req.body.desc
        })
        await newMovie.save();
        res.status(201).json({ message: "Movie has been created", movie: newMovie })
    } catch (e) {
        console.log(e);
    }
})


module.exports = router;