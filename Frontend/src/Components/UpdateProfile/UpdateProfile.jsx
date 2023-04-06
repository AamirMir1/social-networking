import { Avatar, Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./UpdateProfile.css"
import { useDispatch, useSelector } from 'react-redux'
import { loadUserAccount, updateProfile } from '../../Actions/User'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader/Loader'
const UpdateProfile = () => {
    const dispatch = useDispatch()
    const { message, error, loading } = useSelector((state) => state.user)
    const { user, loading: userLoading } = useSelector((state) => state.me)
    const navigate = useNavigate()

    useEffect(() => {
        if (message) {
            toast.success(message)
            console.log(message)
            dispatch(loadUserAccount())
            navigate("/myaccount")
            dispatch({ type: "clearMessage" })
        }
        if (error) {
            toast.error(error)
            dispatch({ type: "clearErrors" })
        }
    }, [dispatch, message, error, navigate])
    const [inputVal, setInputVal] = useState({
        email: user.email,
        name: user.name
    })
    const [avatar, setAvatar] = useState(user.avatar.url)

    const details = (e) => {
        let name = e.target.name
        let value = e.target.value

        setInputVal((prevValues) => {
            return {
                ...prevValues,
                [name]: value
            }
        })
    }

    const changeAvatar = (e) => {
        const file = e.target.files[0]
        const fileReader = new FileReader()
        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                setAvatar(fileReader.result)
            }
        }
        fileReader.readAsDataURL(file)
    }

    const submitUpdateProfile = () => {
        dispatch(updateProfile(inputVal.name, inputVal.email, avatar))
    }
    return userLoading ? <Loader /> : <div className="UpdateProfile">
        <form action="" className='update-profile-form'>
            <Typography variant="h4" style={{ color: "white", padding: "25px 0px 30px 0px", textAlign: "center" }}>Update Profile</Typography>
            <Avatar src={avatar} style={{ width: "100px", color: "white", height: "100px", margin: "auto" }} />
            <label className="change-profile" htmlFor="avatar">Choose Profile Picture</label>
            <input type="file" name="" onChange={changeAvatar} id="avatar" />
            <input type="text" onChange={details} value={inputVal.name} placeholder='Name' className='controllers' name="name" id="" />
            <input type="email" onChange={details} value={inputVal.email} placeholder='Email' className='controllers' name="email" id="" />
            <Button disabled={loading ? true : false} onClick={submitUpdateProfile} style={{ backgroundColor: loading ? "gray" : "white", color: loading ? "white" : "gray", boxShadow: "white 1px 2px 14px 0px", margin: "auto", display: "block" }}>
                <Typography>Update Profile</Typography>
            </Button>
        </form>
        <ToastContainer position='top-center' theme='colored' autoClose="3000" />
    </div>
}

export default UpdateProfile