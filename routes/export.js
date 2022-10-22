const Movie = require("../models/Movie");
const excelJs = require("exceljs")

const router = require("express").Router()

router.get("/", async (req, res) => {
    try {
        const movieData = await Movie.find()

        const workBook = new excelJs.Workbook();
        const workSheet = workBook.addWorksheet("movie_data")

        workSheet.columns = [
            { header: "Movie_ID", key: "_id" },
            { header: "Movie_Name", key: "movieName" },
            { header: "ImageUrl", key: "image" },
            { header: "Description", key: "desc" },
        ]

        movieData.forEach((movie) => {
            workSheet.addRow(movie)
        })

        workSheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true }
        })

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        res.setHeader(
            "Content-Disposition",
            `attachment;filename=movies.xlsx`
        )


        return workBook.xlsx.write(res).then(() => {
            res.status(200)
        }).catch((e) => {
            res.status(404).json("not found")
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message })
    }
})
module.exports = router;