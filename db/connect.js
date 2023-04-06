const mongoose = require("mongoose")

mongoose.connect(process.env.DB_URI).then(() => {
    console.log("Connected to mongodb")
}).catch((err) => {
    console.log(err)
})