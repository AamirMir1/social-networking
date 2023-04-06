import { Avatar, Button, Typography, Dialog } from '@mui/material';
import React, { useState } from 'react'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { userPosts } from '../../Actions/Post'

import { deleteAccount, loadUserAccount, logout, requestAccept, sendARequest, unfriend, unsendRequest } from '../../Actions/User'
import { toast, ToastContainer } from 'react-toastify'
import LikesUser from '../LikesUser/LikesUser'

import { getUser } from "../../Actions/User";
import "../Account/Account.css"
import Loader from '../Loader/Loader';
import Posts from '../Posts/Posts';
import { AccountBox } from '@mui/icons-material';

const User = () => {
    const params = useParams()
    const [isRequest, setIsRequest] = useState(false)
    const [isSentRequest, setIsSentFriendRequest] = useState(false)
    const [isFriend, setIsFriend] = useState(false)

    const { user, loading, error } = useSelector((state) => state.getuser)
    const { user: me, loading: meLoading } = useSelector((state) => state.me)
    const dispatch = useDispatch()
    const { message, error: deleteError } = useSelector((state) => state.createPost)
    const { posts, loading: postsLoading } = useSelector((state) => state.friendsPosts)
    const [logoutToggle, setLogoutToggle] = useState(false)
    const [friendsToggle, setFriendsToggle] = useState(false)
    const [sentRequestsToggle, setSentRequestsToggle] = useState(false)
    const [deleteToggle, setDeleteToggle] = useState(false)

    useEffect(() => {
        me.friends.forEach((friend) => {
            friend._id === params.id ? setIsFriend(true) : setIsFriend(false)
        })
        me.sentfriendrequest.forEach((sentRequest) => {
            sentRequest._id === params.id ? setIsSentFriendRequest(true) : setIsSentFriendRequest(false)
        })
        me.friendrequest.forEach((request) => {
            request._id === params.id ? setIsRequest(true) : setIsRequest(false)
        })
    }, [params.id, me.friendrequest, me.sentfriendrequest, me.friends])

    useEffect(() => {
        dispatch(userPosts(params.id))
    }, [dispatch, params.id])

    useEffect(() => {
        if (message) {
            toast.success(message)
            dispatch({ type: "clearMessage" })
        }
        if (deleteError) {
            toast.error(message)
            dispatch({ type: "clearErrors" })
        }
        if (error) {
            toast.error(error)
            dispatch({ type: "clearErrors" })
        }
    }, [message, deleteError, error, dispatch])

    const submitLogout = async () => {
        await dispatch(logout())
        dispatch(loadUserAccount())

    }
    const submitDeleteAccount = async () => {
        await dispatch(deleteAccount())
        dispatch(loadUserAccount())

    }
    const [requestsToggle, setRequestsToggle] = useState(false)
    useEffect(() => {
        dispatch(getUser(params.id))
    }, [dispatch, params.id])

    const sendFriendRequest = async () => {
        await dispatch(sendARequest(user._id))
        dispatch(loadUserAccount())
    }

    const submitUnfriend = async () => {
        await dispatch(unfriend(user._id))
        dispatch(loadUserAccount())
    }

    const acceptRequest = async () => {
        await dispatch(requestAccept(user._id))
        dispatch(loadUserAccount())
    }

    const submitUnsendRequest = async () => {
        await dispatch(unsendRequest(user._id))
        dispatch(loadUserAccount())
    }
    const [position, setPosition] = useState("0%")

    const changePosition = () => {
        position === "0%" ? setPosition("105%") : setPosition("0%")
    }
    return loading || meLoading || postsLoading ? <Loader /> : <div className="Account">
        <div onClick={changePosition} className="profile-menu">
            <Button>
                <AccountBox />
            </Button>
        </div>
        {user && me && <>
            <div className="left-content-details" style={{ right: position }}>
                <Avatar src={user.avatar.url} style={{ width: "100px", height: "100px", margin: 'auto' }} />
                <Typography variant="h5" style={{ textAlign: "center", padding: "20px 0px", color: "black", cursor: "default" }}>{user.name}</Typography>
                {me._id === user._id ? null : <>
                    {
                        isFriend ? <Button onClick={submitUnfriend} style={{ display: "block", margin: "14px auto", backgroundColor: "#1976d2", color: "white" }}>
                            <Typography>Unfriend</Typography>
                        </Button> : null
                    }
                    {
                        isRequest ? <Button onClick={acceptRequest} style={{ display: "block", margin: "14px auto", backgroundColor: "#1976d2", color: "white" }}>
                            <Typography>Accept Request</Typography>
                        </Button> : null
                    }
                    {
                        isSentRequest ? <Button onClick={submitUnsendRequest} style={{ display: "block", margin: "14px auto", backgroundColor: "#1976d2", color: "white" }}>
                            <Typography>Unsend Request</Typography>
                        </Button> : null
                    }
                    {
                        !isSentRequest && !isRequest && !isFriend ? <Button onClick={sendFriendRequest} style={{ display: "block", margin: "14px auto", backgroundColor: "#1976d2", color: "white" }}>
                            <Typography>Add Friend</Typography>
                        </Button> : null
                    }
                </>}
                <Button onClick={() => setFriendsToggle(!friendsToggle)} style={{ display: "block", margin: "14px auto", color: "white" }}>
                    <Typography>Friends</Typography>
                </Button>
                {me._id === user._id ? <div className='forme'>
                    <Link to={"/update/profile"}>
                        <Button style={{ display: "block", margin: "14px auto", color: "white" }}>
                            <Typography>Update Profile</Typography>
                        </Button>
                    </Link>
                    <Link to={"/update/password"}>
                        <Button style={{ display: "block", margin: "14px auto", color: "white" }}>
                            <Typography>Change Password</Typography>
                        </Button>
                    </Link>
                    <Button onClick={() => setRequestsToggle(!requestsToggle)} style={{ display: "block", margin: "14px auto", color: "gray" }}>
                        <Typography>Friend Requests</Typography>
                    </Button>
                    <Button onClick={() => setSentRequestsToggle(!sentRequestsToggle)} style={{ display: "block", margin: "14px auto", color: "white" }}>
                        <Typography>Sent Friend Requests</Typography>
                    </Button>


                    <Button onClick={() => setLogoutToggle(!logoutToggle)} style={{ display: "block", margin: "14px auto", color: "white" }}>
                        <Typography>Logout</Typography>
                    </Button>
                    <Button onClick={() => setDeleteToggle(!deleteToggle)} style={{ display: "block", margin: "14px auto", color: "white" }}>
                        <Typography>Delete My Account</Typography>
                    </Button>
                </div> : null}

            </div>
            <div className="right-user-posts">
                {posts && posts.length > 0 ? posts.map((post) => {
                    return <Posts avatar={post.owner.avatar.url} comments={post.comments} image={post.image.url} isAccount={me._id === user._id ? true : false} isDelete={me._id === user._id ? true : false} likes={post.likes} owner={post.owner} postId={post._id} userId={post.owner._id} key={post._id} caption={post.caption} />
                }) : <Typography style={{ paddingTop: "80px", textAlign: "center" }} variant="h6">User has not made any posts yet</Typography>}
            </div>
            <Dialog open={logoutToggle} onClose={() => setLogoutToggle(!logoutToggle)}>
                <div className="AboutLogout">
                    <Typography style={{ margin: "10px 0px" }}>Are you sure you want to logout your account?</Typography>
                    <Button onClick={submitLogout} style={{ backgroundColor: "#1976d2", color: "white" }}>
                        <Typography>Yes</Typography>
                    </Button>
                    <Button onClick={() => setLogoutToggle(!logoutToggle)}>
                        <Typography>No</Typography>
                    </Button>
                </div>
            </Dialog>
            <Dialog open={deleteToggle} onClose={() => setDeleteToggle(!deleteToggle)}>
                <div className="AboutLogout">
                    <Typography style={{ margin: "10px 0px" }}>Are you sure you want to delete your account permanently?</Typography>
                    <Button onClick={submitDeleteAccount} style={{ backgroundColor: "#1976d2", color: "white" }}>
                        <Typography>Yes</Typography>
                    </Button>
                    <Button onClick={() => setDeleteToggle(!deleteToggle)}>
                        <Typography>No</Typography>
                    </Button>
                </div>
            </Dialog>
            <Dialog open={friendsToggle} onClose={() => setFriendsToggle(!friendsToggle)}>
                <div className="Friends">
                    {
                        user && user.friends.length > 0 ? user.friends.map((friend) => {
                            return <LikesUser addfriend={false} friend={me._id === user._id ? true : false} avatar={friend.avatar.url} name={friend.name} request={false} userId={friend._id} key={friend._id} />
                        }) : <Typography variant="h6">{me._id === user._id ? "You have no friends" : "This user has no friends"}</Typography>
                    }
                </div>
            </Dialog>
            <Dialog open={requestsToggle} onClose={() => setRequestsToggle(!requestsToggle)}>
                <div className="Friends">
                    {
                        user && user.friendrequest.length > 0 ? user.friendrequest.map((request) => {
                            return <LikesUser addfriend={false} friend={false} avatar={request.avatar.url} name={request.name} request={false} getRequest={true} userId={request._id} key={request._id} />
                        }) : <Typography variant="h6">You have no friend request yet</Typography>
                    }
                </div>
            </Dialog>
            <Dialog open={sentRequestsToggle} onClose={() => setSentRequestsToggle(!sentRequestsToggle)}>
                <div className="Friends">
                    {
                        user && user.sentfriendrequest.length > 0 ? user.sentfriendrequest.map((sentrequest) => {
                            return <LikesUser addfriend={false} friend={false} avatar={sentrequest.avatar.url} name={sentrequest.name} request={false} sentRequest={true} getRequest={false} userId={sentrequest._id} key={sentrequest._id} />
                        }) : <Typography variant="h6">You have not send a friend request to someone</Typography>
                    }
                </div>
            </Dialog>
            <ToastContainer autoClose="3000" theme='colored' position='top-center' />
        </>
        }

    </div >
}

export default User;