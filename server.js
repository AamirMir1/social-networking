require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const cors = require("cors")
const cloudinary = require("cloudinary")
const cookieParser = require("cookie-parser")
const path = require("path")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

require("./db/connect")

// Middleswares
app.use(cors({ credentials: true }))
app.use(cookieParser())
app.use(express.json({ limit: "100mb" }))
app.use(express.urlencoded({ extended: true, limit: "100mb" }))
app.use(require("./Router/routes"))

// Serving Frontend

app.use(express.static(path.join(__dirname, "./Frontend/build")))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./Frontend/build/index.html")),
        function (err) {
            res.status(500).send(err)
        }
})
// Listening to the server

app.listen(port, () => {
    console.log(`Listening to the server at port:${port}`)
})