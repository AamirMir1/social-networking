import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AddAPhotoOutlined, Home } from '@mui/icons-material'
import { HomeOutlined } from '@mui/icons-material'
import { People } from '@mui/icons-material'
import { PeopleOutlined } from '@mui/icons-material'
import { AccountCircle } from '@mui/icons-material'
import { AccountCircleOutlined } from '@mui/icons-material'
import { AddAPhoto } from '@mui/icons-material'
import { Search, SearchOutlined } from '@mui/icons-material'
import { Button } from '@mui/material'
import "./Header.css"
const Header = () => {

    const [tab, setTab] = useState(window.location.pathname)

    return <div className="Header">
        <header>
            <nav>
                <Link to="/" onClick={() => setTab("/")}>
                    <Button>
                        {tab === "/" ? <Home /> : <HomeOutlined />}
                    </Button>
                </Link>
                <Link to="/friends" onClick={() => setTab("/friends")}>
                    <Button>
                        {tab === "/friends" ? <People /> : < PeopleOutlined />}
                    </Button>
                </Link>
                <Link to="/createpost" onClick={() => setTab("/createpost")}>
                    <Button>
                        {tab === "/createpost" ? <AddAPhoto /> : < AddAPhotoOutlined />}
                    </Button>
                </Link>
                <Link to="/myaccount" onClick={() => setTab("/myaccount")}>
                    <Button>
                        {tab === "/myaccount" ? <AccountCircle /> : < AccountCircleOutlined />}
                    </Button>
                </Link>
                <Link to="/search/user" onClick={() => setTab("/friends")}>
                    <Button>
                        {tab === "/search/user" ? <Search /> : < SearchOutlined />}
                    </Button>
                </Link>
            </nav>
        </header>
    </div>
}

export default Header