import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Components/Login/Login'
import "./App.css"
import Header from './Components/Header/Header'
import { useDispatch, useSelector } from 'react-redux'
import { loadUserAccount } from './Actions/User'
import Home from './Components/Home/Home'
import CreatePost from './Components/CreatePost/CreatePost'
import AddFriends from './Components/AddFriends/AddFriends'
import Account from './Components/Account/Account'
import UpdateProfile from './Components/UpdateProfile/UpdateProfile'
import UpdatePassword from './Components/UpdatePassword/UpdatePassword'
import Loader from './Components/Loader/Loader'
import User from './Components/User/User'
import SearchUser from './Components/Search/SearchUser'
import ResetPassword from './Components/ResetPassword/ResetPassword'

const App = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.me)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadUserAccount())
  }, [dispatch])
  return loading ? <Loader /> : <div className="App">
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path='/' element={isAuthenticated ? <Home /> : <Login />} />
        <Route path='/createpost' element={isAuthenticated ? <CreatePost /> : <Login />} />
        <Route path='/friends' element={isAuthenticated ? <AddFriends /> : <Login />} />
        <Route path='/myaccount' element={isAuthenticated ? <Account /> : <Login />} />
        <Route path='/update/profile' element={isAuthenticated ? <UpdateProfile /> : <Login />} />
        <Route path='/update/password' element={isAuthenticated ? <UpdatePassword /> : <Login />} />
        <Route path='/user/:id' element={isAuthenticated ? <User /> : <Login />} />
        <Route path='/search/user' element={isAuthenticated ? <SearchUser /> : <Login />} />
        <Route path='/api/v1/reset/password/:token' element={<ResetPassword />} />
      </Routes>

    </Router>
  </div>
}

export default App