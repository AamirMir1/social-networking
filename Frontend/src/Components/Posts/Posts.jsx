import { Avatar, Dialog, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./Posts.css"
import { Button } from "@mui/material"
import { Delete, ThumbUp } from "@mui/icons-material"
import { ThumbUpOutlined, CommentOutlined, Menu } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { commentOnPost, deleteMyPost, friendsPosts, likePosts, myPosts, updatePostCaption } from '../../Actions/Post'
import LikesUser from '../LikesUser/LikesUser'
import CommentsCard from '../CommentsCard/CommentsCard'
import { loadUserAccount } from '../../Actions/User'

const Posts = ({ userId, postId, likes, comments, avatar, caption, image, owner, isAccount, isDelete }) => {

    const [like, setLike] = useState(false)
    const [liked, setLiked] = useState(likes.length)
    const [likeToggle, setLikeToggle] = useState(false)
    const [commentToggle, setCommentToggle] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [commentVal, setCommentVal] = useState("")
    const dispatch = useDispatch()

    const likePost = async () => {
        await dispatch(likePosts(postId))
        await setLike(!like)
        if (isAccount) {
            dispatch(loadUserAccount())
        }
        like ? setLiked(liked - 1) : setLiked(liked + 1)
    }
    const { user } = useSelector((state) => state.me)

    useEffect(() => {
        likes.forEach((like) => {
            if (like._id === user._id) {
                setLike(true)
            }
        })
    }, [likes, user._id])

    const submitComment = async (e) => {
        e.preventDefault()
        await dispatch(commentOnPost(postId, commentVal))
        if (isAccount) {
            dispatch(myPosts())
        } else {
            dispatch(friendsPosts())
        }
    }
    const [menu, setMenu] = useState(false)
    const [updateCaption, setUpdateCaption] = useState(caption)

    const submitUpdateCaption = async () => {
        await dispatch(updatePostCaption(postId, updateCaption))
        if (isAccount) {
            dispatch(myPosts())
        } else {
            dispatch(friendsPosts())
        }
    }
    const deletePost = async () => {
        await dispatch(deleteMyPost(postId))
        if (isAccount) {
            dispatch(myPosts())
        } else {
            dispatch(friendsPosts())
        }
    }
    return <div className="Post" style={{ marginTop: isAccount ? "30px" : null }}>
        <div className="user">
            <div className="name-avatar">
                <Avatar className='user-picture' src={avatar} />
                <Typography className='user-name'>{owner.name}</Typography>
            </div>
            {
                isAccount ? <Button onClick={() => setMenu(!menu)}>
                    <Menu />
                </Button> : null
            }

        </div>
        <div className="caption">
            <Typography>{caption}</Typography>
        </div>
        <figure>
            <img className='post-image' src={image} alt="" />
        </figure>
        <div className="like-comments">
            <Button onClick={likePost}>
                {like ? <ThumbUp /> : <ThumbUpOutlined />}
            </Button>
            <Button onClick={() => setCommentToggle(true)}>
                <CommentOutlined />
            </Button>
            {
                isDelete ? <Button onClick={deletePost}>
                    <Delete />
                </Button> : null
            }

            <Button disabled={liked <= 0 ? true : false} onClick={() => setLikeToggle(!likeToggle)}>
                <Typography>{liked} Likes</Typography>
            </Button>
            <Button disabled={comments.length <= 0 ? true : false} onClick={() => setShowComments(!showComments)}>
                <Typography>{comments.length} Comments</Typography>
            </Button>
        </div>
        <Dialog open={likeToggle} onClose={() => setLikeToggle(!likeToggle)}>
            {
                likes.map((like) => {
                    return <LikesUser key={like._id} userId={like._id} avatar={like.avatar.url} name={like.name} />
                })
            }
        </Dialog>
        <Dialog open={commentToggle} onClose={() => setCommentToggle(!commentToggle)}>
            <div className="comments-container">
                <form action="" onSubmit={submitComment}>
                    <div className="add-comment">
                        <input onChange={(e) => setCommentVal(e.target.value)} type="text" name="" className="add-comment-input" placeholder='Add a comment...' id="" />
                        <Button type='submit' style={{ backgroundColor: "#3498db", color: "white" }}>
                            Add Comment
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
        <Dialog open={showComments} onClose={() => setShowComments(!showComments)}>
            {
                comments.map((item) => {
                    return <CommentsCard key={item._id} postId={postId} commentId={item._id} commentUserId={item.user._id} avatar={item.user.avatar.url} isAccount={isAccount} isDelete={isDelete} firstname={item.user.firstname} lastname={item.user.lastname} comment={item.comment} />
                })
            }

        </Dialog>
        <Dialog open={menu} onClose={() => setMenu(!menu)}>
            <div className="comments-container">
                <form action="" onSubmit={submitComment}>
                    <div className="add-comment">
                        <input onChange={(e) => setUpdateCaption(e.target.value)} type="text" name="" className="add-comment-input" placeholder='Update caption...' value={updateCaption} id="" />
                        <Button type='submit' onClick={submitUpdateCaption} style={{ backgroundColor: "#3498db", color: "white" }}>
                            Update Caption
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
    </div>
}

export default Posts