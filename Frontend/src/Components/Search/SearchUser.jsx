import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { searchUsers } from "../../Actions/User"
import { Search } from '@mui/icons-material'
import "../AddFriends/AddFriends.css"
import LikesUser from "../LikesUser/LikesUser"
import "./SearchUser.css"
const SearchUser = () => {
    const [name, setName] = useState("")
    const { users } = useSelector((state) => state.searchUser)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(searchUsers())
    }, [dispatch])
    const searchUser = () => {
        dispatch(searchUsers(name))
    }
    return <div className="AddFriends">
        <div className="right-space"></div>
        <div className="friends-to-add">
            <div className="left-users">
                <div className="search-handlers next-search">
                    <input type="text" name="" value={name} onChange={(e) => setName(e.target.value)} placeholder='Find Someone...' id="" />
                    <button className='search-btn' onClick={searchUser} style={{ cursor: "pointer" }} >
                        <Search />
                    </button>
                </div>
                <div className="all-users next-all-users">
                    {
                        users && users.length > 0 ? users.map((user) => {
                            return <LikesUser userId={user._id} avatar={user.avatar.url} name={user.name} />
                        }) : <Typography style={{ textAlign: "center" }}>No Users Found</Typography>
                    }
                </div>
            </div>
        </div>
        <div className="left-space"></div>
    </div>
}

export default SearchUser
