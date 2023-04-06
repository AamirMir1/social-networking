import React, { useEffect, useState } from 'react'
import { Button, Typography, Dialog, Avatar } from "@mui/material"
import "./Login.css"
import { useDispatch, useSelector } from 'react-redux'
import { loadUserAccount, loginAccount, registerUser, sendToken } from '../../Actions/User'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

const Login = () => {
    const { error, message, loading } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [toggleDialog, setToggleDialog] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [profilePicture, setProfilePicture] = useState(null)
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const { message: sendTokenMessage, loading: sendTokenLoading, error: sendTokenError } = useSelector((state) => state.resetPassword)
    const [resetEmail, setResetEmail] = useState("")

    const [toggleForgot, setToggleForgot] = useState(false)
    useEffect(() => {
        if (sendTokenError) {
            toast.error(sendTokenError)
            dispatch({ type: "clearErrors" })
        }
        if (sendTokenMessage) {
            toast.success(sendTokenMessage)
            setToggleForgot(!toggleForgot)
            setResetEmail("")
            dispatch({ type: "clearMessage" })
        }
    }, [sendTokenError, sendTokenMessage, dispatch, toggleForgot])

    useEffect(() => {
        if (message) {
            toast.success(message)
            dispatch({ type: "clearMessage" })
            dispatch(loadUserAccount())
            setToggleDialog(false)
            setLoginEmail("")
            setLoginPassword("")
        }
        if (error) {
            toast.error(error)
            dispatch({ type: "clearErrors" })
        }
    }, [error, message, dispatch])

    const signup = (e) => {
        e.preventDefault()
        dispatch(registerUser(profilePicture, name, email, password, confirmPassword))
    }

    const getImage = (e) => {
        const file = e.target.files[0]
        const fileReader = new FileReader()
        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                setProfilePicture(fileReader.result)
            }
        }
        fileReader.readAsDataURL(file)
    }
    const login = async (e) => {
        e.preventDefault()
        await dispatch(loginAccount(loginEmail, loginPassword))
    }
    const sendUserToken = () => {
        dispatch(sendToken(resetEmail))
    }
    return <div className="Login">
        <div className="content">
            <div className="left-content">
                <Typography variant="h2" style={{ color: "#1976d2", fontWeight: "bold" }}>Social Network</Typography>
                <Typography variant="h5"> Social network helps you connect and share <br /> with the people in your life.</Typography>
            </div>
            <div className="right-content">
                <form action="" onSubmit={login}>
                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder='Email address' name="" id="" />
                    <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder='Password' name="" id="" />
                    <Button type="submit" disabled={loading ? true : false} style={{ backgroundColor: loading ? "gray" : "#1877f2", width: "100%" }}>
                        <Typography variant="h6" style={{ color: "white" }}>Log in</Typography>
                    </Button>
                    <Button>
                        <p onClick={() => setToggleForgot(!toggleForgot)} variant="h7" style={{ cursor: "pointer", color: "gray" }} className="forget">Forgotten password?</p>
                    </Button>
                    <hr />
                    <Button className="create-account" style={{ backgroundColor: "#42b72a", color: "white" }} onClick={() => setToggleDialog(!toggleDialog)}>
                        <Typography variant="h6">Create New Account</Typography>
                    </Button>
                </form>
            </div>
        </div>
        <Dialog className='register-dialog' open={toggleDialog} onClose={() => setToggleDialog(!toggleDialog)}>
            <form action="" className='register' onSubmit={signup}>
                <Typography variant="h5">Sign Up</Typography>
                <p>It's quick and easy</p>
                <hr />
                <Avatar style={{ margin: "auto", width: "90px", height: "90px" }} src={profilePicture}></Avatar>
                <label className='labels' htmlFor="img">{<Typography>Choose a profile picture</Typography>}</label>
                <input className='labels' type="file" onChange={getImage} id="img" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="register-inputs" id="" placeholder="Full name" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="register-inputs" placeholder='Email address' id="" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className="register-inputs" id="" />
                <input type="password" placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="register-inputs" id="" />
                <Typography className='register-text'>People who use our service may have uploaded your contact information to Facebook. Learn more.</Typography>
                <Typography className='register-text'>By clicking Sign Up, you agree to our Terms. Privacy Policy and Cookies Policy. You may receive SMS notifications from ur and can opt out at any time.</Typography>
                <Button disabled={loading ? true : false} type="submit" style={{ backgroundColor: loading ? "gray" : "#00a400", color: "white", borderRadius: "15px", padding: "5px 16px", margin: "20px 0px 0px 0px" }}>
                    <Typography variant="h6">Sign Up</Typography>
                </Button>
            </form>
        </Dialog>
        <Dialog className='register-dialog' open={toggleForgot} onClose={() => setToggleForgot(!toggleForgot)}>
            <div className="sendToken">
                <input type="email" name="" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder='Email...' />
                <Button disabled={sendTokenLoading ? true : false} onClick={sendUserToken} style={{ backgroundColor: sendTokenLoading ? "gray" : "#3498db", color: "white" }}>Send Token</Button>
            </div>
        </Dialog>

        <ToastContainer theme='colored' autoClose="5000" position='top-center' />
    </div >

}

export default Login