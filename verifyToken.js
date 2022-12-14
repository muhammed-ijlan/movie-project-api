const jwt = require("jsonwebtoken");
const User = require("./models/User")

async function verify(req, res, next) {

    const cookieToken = req.cookies.accessToken

    if (cookieToken) {
        const verifyUser = jwt.verify(cookieToken, process.env.SECRET)

        const user = await User.findOne({ _id: verifyUser._id })
        console.log(user);

        const verifyTokens = user.tokens.map(currentEl => {
            return currentEl.token === cookieToken
        })

        if (verifyTokens.includes(true)) {
            req.user = verifyUser;
            req.token = cookieToken;

            next();
        } else {
            res.status(401).json("you are not authenticated!")
        }

    } else {
        res.status(401).json("You are not authenticated !")
    }
}
module.exports = verify;