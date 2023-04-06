import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { friendsPosts } from '../../Actions/Post'
import Posts from '../Posts/Posts'
import "./Home.css"
import { toast, ToastContainer } from 'react-toastify'
import Loader from '../Loader/Loader'
import { Typography } from '@mui/material'
import { Search } from '@mui/icons-material'
import LikesUser from '../LikesUser/LikesUser'
import { searchUsers } from '../../Actions/User'
const Home = () => {
    const { posts, error, loading } = useSelector((state) => state.friendsPosts)
    const { message, error: likeError } = useSelector((state) => state.commentPost)
    const { user } = useSelector((state) => state.me)

    const [name, setName] = useState("")

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(friendsPosts())
    }, [dispatch])
    useEffect(() => {
        if (message) {
            toast.success(message)
            dispatch({ type: "clearMessage" })
        }
        if (error) {
            toast.error(error)
            dispatch({ type: "clearErrors" })
        }
        if (likeError) {
            toast.error(likeError)
            dispatch({ type: "clearErrors" })
        }

    }, [error, message, dispatch, likeError])

    const { users } = useSelector((state) => state.searchUser)

    useEffect(() => {
        dispatch(searchUsers())
    }, [dispatch])
    const searchUser = () => {
        dispatch(searchUsers(name))
    }
    return loading ? <Loader /> : <div className="Home">
        <div className="left-users new-lefts">
            <div className="search-handlers">
                <input type="text" name="" value={name} onChange={(e) => setName(e.target.value)} placeholder='Find Someone...' id="" />
                <button className='search-btn' onClick={searchUser} style={{ cursor: "pointer" }} >
                    <Search />
                </button>
            </div>
            <div className="all-users">
                {
                    users && users.length > 0 ? users.map((user) => {
                        return <LikesUser userId={user._id} avatar={user.avatar.url} name={user.name} />
                    }) : <Typography style={{ textAlign: "center" }}>No Users Found</Typography>
                }
            </div>
        </div>
        <div className="middle-posts">
            {
                posts && posts.length > 0 ? posts.map((post) => {
                    return <Posts key={post._id} postId={post._id} userId={post._id} image={post.image.url} avatar={post.owner.avatar.url} caption={post.caption} likes={post.likes} owner={post.owner} comments={post.comments} isAccount={false} isDelete={false} />
                }) : <Typography style={{ textAlign: "center", margin: "30px 0px" }}>Your friends have not made any post yet</Typography>
            }
        </div>
        <div className="right-requests">
            <Typography style={{ textAlign: "center", margin: "80px 0px 30px 0px" }}>{
                user.friendrequest.length > 0 ? "Friend Requests" : "No friend request yet"
            }</Typography>
            {
                user.friendrequest.map((request) => {
                    return <LikesUser key={request._id} avatar={request.avatar.url} userId={request._id} addfriend={false} name={request.name} request={true} />
                })
            }

        </div>
        <ToastContainer position='top-center' autoClose="3000" theme='colored' />
    </div>
}

export default Home