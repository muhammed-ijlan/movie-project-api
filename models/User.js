const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    isAdmin: { type: Boolean, default: false },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    movieList: { type: [String], default: [], },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET);
        this.tokens = this.tokens?.concat({ token: token })
        await this.save()
        return token;
    } catch (er) {
        console.log(er);
    }
}

module.exports = mongoose.model("User", userSchema)