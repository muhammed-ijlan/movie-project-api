const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({
    image: String,
    movieName: String,
    desc: String
})

module.exports = mongoose.model("Movie", movieSchema)