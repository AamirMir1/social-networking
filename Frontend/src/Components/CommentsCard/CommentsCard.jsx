import { DeleteForever } from '@mui/icons-material'
import { Avatar, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./CommentsCard.css"
import { useDispatch, useSelector } from 'react-redux'
import { deleteComment, friendsPosts, myPosts } from '../../Actions/Post'

const CommentsCard = ({ avatar, name, comment, isAccount, commentUserId, postId, commentId }) => {

    const { user } = useSelector((state) => state.me)
    const [isDelete, setIsDelete] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        user._id === commentUserId ? setIsDelete(true) : setIsDelete(false)
    }, [user._id, commentUserId])

    const handleDeleteComment = async () => {
        await dispatch(deleteComment(postId, commentId))
        if (isAccount) {
            dispatch(myPosts())
        } else {
            dispatch(friendsPosts())
        }
    }
    return <div className="CommentsCard">
        <Avatar src={avatar} />
        <Typography style={{ fontWeight: "bold", margin: "0px 15px" }}>{name}</Typography>
        <Typography>{comment}</Typography>
        {
            isAccount || isDelete ? <Button onClick={handleDeleteComment}>
                <DeleteForever />
            </Button> : null
        }
    </div>
}

export default CommentsCard