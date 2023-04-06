import { configureStore } from '@reduxjs/toolkit'
import { commentPostReducer, createPostReducer, friendsPostsReducer } from './Reducers/Post'
import { customReducer, loadUser, searchAUser, addFriendsReducer, getUserReducer, resetPasswordReducer } from './Reducers/User'

const store = configureStore({
    reducer: {
        user: customReducer,
        me: loadUser,
        friendsPosts: friendsPostsReducer,
        createPost: createPostReducer,
        commentPost: commentPostReducer,
        searchUser: searchAUser,
        addFriends: addFriendsReducer,
        getuser: getUserReducer,
        resetPassword: resetPasswordReducer
    }
})

export default store
