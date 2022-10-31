const mongoose = require("mongoose")

const sampleSchema = new mongoose.Schema({
    product: String,
    total: Number,
    customer: String
})

module.exports = mongoose.model("Sample", sampleSchema)