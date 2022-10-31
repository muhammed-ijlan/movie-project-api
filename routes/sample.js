// const router = require("express").Router();
// const Sample = require("../models/Sample")

// router.post("/", async (req, res) => {
//     try {
//         const newUserdata = new Sample(
//             { product: "toothbrush", total: 4.75, customer: "Mike" },
//             { product: "guitar", total: 199.99, customer: "Tom" },
//             { product: "milk", total: 11.33, customer: "Mike" },
//             { product: "pizza", total: 8.50, customer: "Karen" },
//             { product: "toothbrush", total: 4.75, customer: "Karen" },
//             { product: "pizza", total: 4.75, customer: "Dave" },
//             { product: "toothbrush", total: 4.75, customer: "Mike" },
//         )
//         await newUserdata.save();
//         res.status(201).json(newUserdata)
//     } catch (e) {
//         console.log(e)
//         res.status(500).json(e.message)
//     }
// })

// router.get("/", async (req, res) => {
//     // const sampleData = await Sample.aggregate([

//     // ])
// })

// module.exports = router;