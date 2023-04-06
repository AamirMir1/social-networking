import { Avatar, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import "./CreatePost.css"
import { Photo } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { createPost } from '../../Actions/Post';
import { toast, ToastContainer } from 'react-toastify'
import { getUser } from '../../Actions/User';

const CreatePost = () => {
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState(null)
    const dispatch = useDispatch()
    const { message, loading, error } = useSelector((state) => state.createPost)

    const getImage = (e) => {
        const file = e.target.files[0]
        const Reader = new FileReader()
        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setImage(Reader.result)
            }
        }
        Reader.readAsDataURL(file)
    }
    const submitPost = async () => {
        await dispatch(createPost(caption, image))
        dispatch(getUser())
    }
    useEffect(() => {
        if (message) {
            toast.success(message)
            dispatch({ type: "clearMessage" })
            setCaption("")
            setImage(null)
        }
        if (error) {
            toast.error(error)
            dispatch({ type: "clearErrors" })
        }
    }, [dispatch, error, message])

    return <div className="CreatePost">
        <Typography className='create-post' variant='h4'>Let's Create A Post</Typography>
        <div className="post">
            <Avatar src={image} style={{ width: "150px", height: "150px", margin: "30px auto" }}>
                <Photo style={{ width: "100px", height: "100px" }} />
            </Avatar>
            <input type="text" name="" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="What's on your mind?" id="" />

            <label htmlFor="post-image" style={{ backgroundColor: loading ? "#bdbdbd" : "" }} className='choose-photo-post'>Choose A Photo</label>
            <input type="file" disabled={loading ? true : false} onChange={getImage} name="" id="post-image" accept='/image' />
            <Button onClick={submitPost} disabled={loading ? true : false} className="create-post-button" style={{ display: "block", margin: "30px auto", backgroundColor: loading ? "#bdbdbd" : "#1976d2", color: "white", padding: "10px 50px", borderRadius: "30px" }}><a href="/" variant="h6">Post</a></Button>
        </div>
        <ToastContainer position='top-center' theme='colored' autoClose="3000" />
    </div >
}

export default CreatePost;