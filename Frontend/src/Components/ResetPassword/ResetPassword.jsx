import { Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "../UpdateProfile/UpdateProfile.css"
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../../Actions/User'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const ResetPassword = () => {
    const dispatch = useDispatch()
    const { message, loading, error } = useSelector((state) => state.resetPassword)
    const params = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if (error) {
            toast.error(error)
            dispatch({ type: "clearErrors" })
        }
        if (message) {
            toast.success(message)
            navigate("/")
            dispatch({ type: "clearMessage" })
        }
    }, [error, message, dispatch, navigate])

    const [password, setPassword] = useState("")

    const submitResetPassword = () => {
        dispatch(resetPassword(params.token, password))
    }

    return <div className="UpdateProfile">
        <form action="" className='update-profile-form update-password-form'>
            <Typography variant="h4" style={{ color: "white", padding: "25px 0px 30px 0px", textAlign: "center" }}>Reset Password</Typography>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='New Password...' className='controllers' name="newpassword" id="" />
            <Button onClick={submitResetPassword} disabled={loading ? true : false} style={{ backgroundColor: loading ? "gray" : "white", color: loading ? "white" : "gray", boxShadow: "white 1px 2px 14px 0px", margin: "auto", display: "block" }}>
                Reset Password
            </Button>
        </form>
        <ToastContainer position='top-center' theme='colored' autoClose="3000" />
    </div>
}

export default ResetPassword