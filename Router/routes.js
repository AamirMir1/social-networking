const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Post = require("../models/Post")
const auth = require("../Middlewares/auth")
const sendEmail = require("../Middlewares/sendEmail")
const crypto = require("crypto")
const cloudinary = require('cloudinary')

// Creating Account 

router.post("/create/account", async (req, res) => {
    try {
        const { name, email, password, confirmpassword, avatar } = req.body

        if (!name || !email || !password || !confirmpassword) {
            return res.status(404).json({
                success: false,
                message: "Please fill all the fields"
            })
        }
        if (!avatar) {
            return res.status(404).json({
                success: false,
                message: "Please Select A Profile Picture"
            })
        }

        const user = await User.findOne({ email })

        if (password !== confirmpassword) {
            return res.status(400).json({
                success: false,
                message: "Password is not matching"
            })
        }

        if (user) {
            return res.status(401).json({
                success: false,
                message: "Email already exists"
            })
        }
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "FacebookCloneUsersProfilePictures",
            timeout: 10 * 60 * 1000
        })

        const newUser = await new User({
            name,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            },
            email,
            password,
        })

        await newUser.save()

        res.status(201).json({
            success: true,
            message: "Account Created Successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Login Account

router.post("/login/account", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }

        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email doesn't exists"
            })
        }

        const isMatch = await user.checkPassword(password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect"
            })
        }
        const token = await user.generateAuthToken()
        res.status(200).cookie("token", token, {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true
        })
        res.status(200).json({
            success: true,
            message: "Logged In Successfully",
            token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Create Post

router.post("/upload/post", auth, async (req, res) => {
    try {
        const { caption, image } = req.body

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Please Select A Picture For Post"
            })
        }

        const myCloud = await cloudinary.v2.uploader.upload(image, {
            folder: "FacebookClonePosts"
        })
        let post = new Post({
            caption: req.body.caption,
            owner: req.id,
            image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        })

        post = await post.save()

        const user = await User.findById({ _id: req.id })
        user.posts.push(post._id)

        await user.save()

        res.status(201).json({
            success: true,
            message: "Post Created"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Delete Post 

router.delete("/post/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id })
        const user = await User.findById({ _id: req.id })

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if (post.owner.toString() === req.id.toString()) {
            const indexPost = user.posts.indexOf(post._id)
            user.posts.splice(indexPost, 1)
            await user.save()
            await post.remove()
            return res.status(400).json({
                success: false,
                message: "Post Deleted"
            })
        }

        res.status(401).json({
            success: false,
            message: "You are not the owner of the post"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Like & Unlike

router.post("/post/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id })
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if (post.likes.includes(req.id)) {
            const index = post.likes.indexOf(req.id)
            post.likes.splice(index, 1)
            await post.save()
            return res.status(200).json({
                success: true,
                message: "Post Unliked"
            })
        }

        post.likes.push(req.id)
        await post.save()
        res.status(200).json({
            success: true,
            message: "Post Liked"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Send Friend Request & Unsend Friend Request

router.post("/addfriend/:id", auth, async (req, res) => {
    try {
        const userToAdd = await User.findById({ _id: req.params.id })
        const myAccount = await User.findById({ _id: req.id })

        if (!userToAdd) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (userToAdd._id.toString() === req.id.toString()) {
            return res.status(401).json({
                success: false,
                message: "You can't send yourself a friend request"
            })
        }

        if (myAccount.sentfriendrequest.includes(userToAdd._id)) {
            const indexSendRequest = myAccount.sentfriendrequest.indexOf(userToAdd._id)
            const indexReceiveRequest = userToAdd.friendrequest.indexOf(req.id)

            myAccount.sentfriendrequest.splice(indexSendRequest, 1)
            userToAdd.friendrequest.splice(indexReceiveRequest, 1)

            await userToAdd.save()
            await myAccount.save()
            return res.status(200).json({
                success: true,
                message: "Request Unsent"
            })
        }

        myAccount.sentfriendrequest.push(userToAdd._id)
        userToAdd.friendrequest.push(req.id)

        await myAccount.save()
        await userToAdd.save()
        res.status(200).json({
            success: true,
            message: "Request Sent"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Get Friends To Add

router.get("/friends/to/add", auth, async (req, res) => {
    try {
        const me = await User.findById({ _id: req.id })

        const users = await User.find({ _id: { $nin: [...me.friendrequest, ...me.sentfriendrequest, ...me.friends, req.id] } })

        if (!users) {
            return res.status(404).json({
                success: false,
                message: "No Users To Add"
            })
        }

        res.status(200).json({
            success: true,
            users
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Accept Friend Request 

router.post("/friend/accept/:id", auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
        const myAccount = await User.findById({ _id: req.id })

        if (myAccount.friendrequest.includes(user._id)) {
            const indexRequest = myAccount.friendrequest.indexOf(user._id)
            const indexSentRequest = user.sentfriendrequest.indexOf(myAccount._id)
            user.sentfriendrequest.splice(indexSentRequest, 1)
            myAccount.friendrequest.splice(indexRequest, 1)
            if (!user.friends.includes(myAccount._id)) {
                user.friends.unshift(myAccount._id)
                await user.save()
            }
            if (!myAccount.friends.includes(user._id)) {
                myAccount.friends.unshift(user._id)
                await myAccount.save()
            }

            return res.status(200).json({
                success: false,
                message: "Friend Request Accepted"
            })
        }

        res.status(401).json({
            success: false,
            message: "User is not found or invalid"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Get Friends Posts

router.get("/friends/posts", auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.id })

        const posts = await Post.find({ owner: { $in: user.friends } }).populate("likes comments.user owner")

        if (!posts) {
            return res.status(404).json({
                success: false,
                message: "Posts not found"
            })
        }

        res.status(200).json({
            success: true,
            posts: posts.reverse()
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Delete Account

router.delete('/delete/my/account', auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.id })
        const request = user.friendrequest
        const sentrequests = user.sentfriendrequest
        const friends = user.friends
        console.log(friends)
        const posts = user.posts
        const userId = req.user._id

        await user.remove()

        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        // Removing my all posts

        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await post.remove()
        }

        // Removing myself from others sentfriendrequest list

        for (let i = 0; i < request.length; i++) {
            const user = await User.findById(request[i]);
            const indexMySelf = user.sentfriendrequest.indexOf(userId)
            user.sentfriendrequest.splice(indexMySelf, 1)
            await user.save()
        }

        // Removing myself from others friend requests list

        for (let i = 0; i < sentrequests.length; i++) {
            const user = await User.findById(sentrequests[i])
            const indexMySelf = user.friendrequest.indexOf(userId)
            user.friendrequest.splice(indexMySelf, 1)
            await user.save()
        }

        // Removing myself from others friends list

        for (let i = 0; i < friends.length; i++) {
            const friend = await User.findById({ _id: friends[i] })
            const indexMySelf = friend.friends.indexOf(userId)
            friend.friends.splice(indexMySelf, 1)
            await friend.save()
        }

        // Removing my likes my all posts

        const postss = await Post.find()

        for (let i = 0; i < postss.length; i++) {
            const post = await Post.findById(postss[i]._id);
            for (let j = 0; j < post.likes.length; j++) {
                if (post.likes[j].toString() === userId.toString()) {
                    post.likes.splice(j, 1)
                }
            }
            await post.save()
        }

        // Removing my comments from all posts

        for (let i = 0; i < postss.length; i++) {
            const post = await Post.findById(postss[i]._id);
            for (let j = 0; j < post.comments.length; j++) {
                if (post.comments[j].user.toString() === userId.toString()) {
                    post.comments.splice(j, 1)
                }
            }
            await post.save()
        }

        res.status(200).json({
            success: true,
            message: "Account Deleted Successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Delete Request 

router.delete("/delete/request/:id", auth, async (req, res) => {
    try {
        const userToDeleteRequest = await User.findById({ _id: req.params.id })
        const myAccount = await User.findById({ _id: req.id })

        if (myAccount.friendrequest.includes(userToDeleteRequest._id)) {
            const indexToDeleteRequest = myAccount.friendrequest.indexOf(userToDeleteRequest._id)
            const indexToDeleteSentRequest = userToDeleteRequest.sentfriendrequest.indexOf(myAccount._id)
            userToDeleteRequest.sentfriendrequest.splice(indexToDeleteRequest, 1)
            myAccount.friendrequest.splice(indexToDeleteSentRequest, 1)
            await userToDeleteRequest.save()
            await myAccount.save()
            return res.status(200).json({
                success: false,
                message: "Cancelled"
            })
        }
        res.status(401).json({
            success: false,
            message: "User is not found or has invalid"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Logout

router.get("/account/logout", auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.id })
        user.tokens.filter((item) => {
            return item.token !== req.token
        })

        await user.save()

        res.status(200).cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message: "Logged Out Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Unfriend A Friend

router.delete("/friend/unfriend/:id", auth, async (req, res) => {
    try {
        const myAccount = await User.findById({ _id: req.id })
        const userToUnfriend = await User.findById({ _id: req.params.id })

        if (myAccount.friends.includes(userToUnfriend._id)) {
            const indexFriend = myAccount.friends.indexOf(userToUnfriend._id)
            const indexMySelf = userToUnfriend.friends.indexOf(myAccount._id)

            myAccount.friends.splice(indexFriend, 1)
            userToUnfriend.friends.splice(indexMySelf, 1)

            await myAccount.save()
            await userToUnfriend.save()

            return res.status(200).json({
                success: true,
                message: "Unfriended"
            })
        }

        res.status(401).json({
            success: false,
            message: "User is not found or has invalid"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Add Or Update Comment

router.post("/post/comment/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id })

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        let commentExists = -1

        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.id.toString()) {
                commentExists = index
            }
        })

        if (commentExists !== -1) {
            post.comments[commentExists].comment = req.body.comment
            await post.save()
            return res.status(200).json({
                success: true,
                message: "Comment Updated"
            })
        }

        post.comments.push({
            user: req.id,
            comment: req.body.comment
        })

        await post.save()

        res.status(200).json({
            success: true,
            message: "Comment Added"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Delete Comment From Post
router.delete("/comment/delete/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id })

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }
        const { commentId } = req.body
        if (post.owner.toString() === req.id.toString() && commentId) {
            post.comments.forEach((item, index) => {
                if (item._id.toString() === req.body.commentId.toString()) {
                    post.comments.splice(index, 1)
                }
            })
            await post.save()
            return res.status(200).json({
                success: true,
                message: "Your Selected Comment Deleted"
            })
        } else {
            post.comments.forEach((item, index) => {
                if (item.user.toString() === req.id.toString()) {
                    post.comments.splice(index, 1)
                }
            })
            await post.save()
            return res.status(200).json({
                success: true,
                message: "Your Comment Deleted"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Update Password

router.put("/update/password", auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.id }).select("+password +confirmpassword")
        console.log(user)
        const { oldpassword, newpassword } = req.body
        if (!oldpassword || !newpassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }

        const isMatch = await user.checkPassword(oldpassword)
        if (isMatch) {
            user.password = newpassword
            await user.save()
            return res.status(200).json({
                success: true,
                message: "Password Updated"
            })
        }

        res.status(401).json({
            success: false,
            message: "Your old password is incorrect"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Update Profile 

router.put("/update/profile", auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.id })
        const { name, email, avatar } = req.body

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }

        if (!avatar) {
            return res.status(400).json({
                success: false,
                message: "Please Select A Profile"
            })
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "FacebookCloneUsersProfilePictures",
            timeout: 10 * 60 * 1000
        })


        await cloudinary.v2.uploader.destroy(user.avatar.public_id)

        user.name = name
        user.email = email
        user.avatar.public_id = myCloud.public_id
        user.avatar.url = myCloud.secure_url


        await user.save()

        res.status(200).json({
            success: true,
            message: "Profile Updated"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Update caption

router.put("/post/update/caption/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id })

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if (post.owner.toString() !== req.id.toString()) {
            return res.status(401).json({
                success: false,
                message: "You Can't Change The Post Caption"
            })
        }

        post.caption = req.body.caption
        await post.save()

        res.status(200).json({
            success: true,
            message: "Caption Updated"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Get My Profile

router.get("/my/profile", auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.id }).populate("posts friends sentfriendrequest friendrequest")

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Get My Posts

router.get("/my/posts", auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.id })

        const postss = user.posts
        const posts = []
        for (let i = 0; i < postss.length; i++) {
            const post = await Post.findById(postss[i]).populate("likes comments.user owner");
            posts.push(post)
        }
        res.status(200).json({
            success: true,
            posts: posts.reverse()
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

router.get("/user/posts/:id", auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })

        const postss = user.posts
        const posts = []
        for (let i = 0; i < postss.length; i++) {
            const post = await Post.findById(postss[i]).populate("likes comments.user owner");
            posts.push(post)
        }
        res.status(200).json({
            success: true,
            posts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Get All Users

router.get("/all/users", auth, async (req, res) => {
    try {
        const users = await User.find({ name: { $regex: req.query.name, $options: "i" } }).populate("posts")
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "No Users Found"
            })
        }
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Generate A Send Reset Password token

router.post("/reset/password", async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please enter email"
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email doesn't exists"
            })
        }

        const resetToken = await user.generateResetPasswordToken()
        await user.save()
        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/reset/password/${resetToken}`
        const message = `Click on the link below to reset password \n \n ${resetUrl}`

        try {
            await sendEmail({
                email: user.email,
                subject: "Reset Password",
                message
            })
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} at mailtrap.io`
            })
        } catch (error) {

            user.resetPasswordToken = undefined
            user.resetPasswordTokenExpires = undefined
            await user.save()
            res.status(500).json({
                success: false,
                message: "Failed to send token"
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

// Let The User To Reset Password
router.put("/api/v1/reset/password/:token", async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

        const user = await User.findOne({ resetPasswordToken, resetPasswordTokenExpires: { $gt: Date.now() } })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or has expired"
            })
        }

        user.password = req.body.password
        await user.save()

        res.status(200).json({
            success: true,
            message: "Password has been reset"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

module.exports = router

// Get A User Profile

router.get("/user/:id", auth, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id }).populate("friendrequest sentfriendrequest friends")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})