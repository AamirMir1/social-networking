import { Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "../UpdateProfile/UpdateProfile.css"
import { useDispatch, useSelector } from 'react-redux'
import { loadUserAccount, updatePassword } from '../../Actions/User'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const UpdateProfile = () => {
    const dispatch = useDispatch()
    const { message, error, loading } = useSelector((state) => state.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (message) {
            toast.success(message)
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
        oldpassword: "",
        newpassword: ""
    })

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

    const submitUpdatePassword = () => {
        dispatch(updatePassword(inputVal.oldpassword, inputVal.newpassword))
    }

    return <div className="UpdateProfile">
        <form action="" className='update-profile-form update-password-form'>
            <Typography variant="h4" style={{ color: "white", padding: "25px 0px 30px 0px", textAlign: "center" }}>Update Profile</Typography>
            <input type="password" onChange={details} value={inputVal.oldpassword} placeholder='Old password...' className='controllers' name="oldpassword" id="" />
            <input type="password" onChange={details} value={inputVal.newpassword} placeholder='New password...' className='controllers' name="newpassword" id="" />
            <Button disabled={loading ? true : false} onClick={submitUpdatePassword} style={{ backgroundColor: loading ? "gray" : "white", color: loading ? "white" : "gray", boxShadow: "white 1px 2px 14px 0px", margin: "auto", display: "block" }}>
                <Typography>Update Password</Typography>
            </Button>
        </form>
        <ToastContainer position='top-center' theme='colored' autoClose="3000" />
    </div>
}

export default UpdateProfile