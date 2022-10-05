const jwt = require("jsonwebtoken")

function verify(req, res, next) {
    const authHeader = req.header.token;
    if (authHeader) {

        jwt.verify(authHeader, process.env.SECRET, (err, user) => {
            if (err) res.status(403).json("Token is not valid!")
            req.user = user;
            next();
        })
    } else {
        res.status(401).json("You are not authenticated !")
    }
}
module.exports = verify;