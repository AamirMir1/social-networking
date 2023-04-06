import { Avatar, Button } from '@mui/material'
import React from 'react'
import "./LikesUser.css"
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteFriendRequest, getFriendsToAdd, loadUserAccount, requestAccept, sendARequest, unfriend, unsendRequest } from '../../Actions/User'


const LikesUser = ({ avatar, name, request, userId, friend, addfriend, getRequest, sentRequest }) => {
  const dispatch = useDispatch()

  const acceptRequest = async () => {
    await dispatch(requestAccept(userId))
    dispatch(loadUserAccount())
  }

  let newstyle = {
    width: "70px",
    height: "70px",
    display: "inline-block",
    verticalAlign: "middle"
  }

  const sendFriendRequest = async () => {
    await dispatch(sendARequest(userId))
    await dispatch(loadUserAccount())
    dispatch(getFriendsToAdd())
  }
  const submitUnfriend = async () => {
    await dispatch(unfriend(userId))
    dispatch(loadUserAccount())
  }

  const submitDeleteRequest = async () => {
    await dispatch(deleteFriendRequest(userId))
    dispatch(loadUserAccount())
  }
  const submitUnsendRequest = async () => {
    await dispatch(unsendRequest(userId))
    dispatch(loadUserAccount())
  }
  return <div className="LikesUserContainer">
    <div className="LikesUser" style={{ position: "relative", width: friend || getRequest || sentRequest ? "500px" : null }}>
      <Link to={`/user/${userId}`}>
        <Avatar src={avatar} style={addfriend ? newstyle : { display: "inline-block", verticalAlign: "middle" }} />
        <a href="/" style={{ margin: "10px 20px", display: "inline-block" }} >{name}</a>
      </Link>
      {
        request ? <Button onClick={acceptRequest} style={{ backgroundColor: "#1976d2", color: "white" }}>
          <a href='/' style={{ fontSize: "12px" }} >Accept</a>
        </Button> : null
      }
      {
        addfriend ? <Button onClick={sendFriendRequest} style={{ position: "absolute", right: "0", backgroundColor: "#1976d2", color: "white", margin: "0px 10px" }}>
          <a href="/">Add Friend</a>
        </Button> : null
      }
      {
        friend ? <Button onClick={submitUnfriend} style={{ position: "absolute", right: "0", backgroundColor: "#1976d2", color: "white", margin: "0px 10px" }}>
          <a href="/">Unfriend</a>
        </Button> : null
      }
      {
        getRequest ? <Button onClick={submitDeleteRequest} style={{ position: "absolute", right: "0", backgroundColor: "#1976d2", color: "white", margin: "0px 10px" }}>
          <a href="/">Delete Request</a>
        </Button> : null
      }
      {
        sentRequest ? <Button onClick={submitUnsendRequest} style={{ position: "absolute", right: "0", backgroundColor: "#1976d2", color: "white", margin: "0px 10px" }}>
          <a href="/">Unsend Request</a>
        </Button> : null
      }
    </div>
  </div>
}

export default LikesUser
