const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        const decodeToken = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findById({ _id: decodeToken._id })

        req.user = user
        req.id = user._id
        req.token = token

        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: Please Login First"
        })
    }
}

module.exports = auth