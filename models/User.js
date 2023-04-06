const mongoose = require("mongoose")
const validator = require("validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    avatar: {
        public_id: String,
        url: String
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already exists"],
        validate: function (value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        select: false
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    friendrequest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    sentfriendrequest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    tokens: [{
        token: String
    }],
    resetPasswordToken: String,
    resetPasswordTokenExpires: String
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 10)
    }
    next()
})

userSchema.methods.checkPassword = async function (password) {
    return await bcryptjs.compare(password, this.password)
}

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: 30 * 24 * 60 * 60 * 1000 })
    this.tokens = this.tokens.concat({ token: token })
    await this.save()
    return token
}

userSchema.methods.generateResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000
    await this.save()
    return resetToken

}

const User = new mongoose.model("User", userSchema)
module.exports = User