const router = require("express").Router();

router.get("/", (req, res) => {
    res.json("hai")
})

module.exports = router;