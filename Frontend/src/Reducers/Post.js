import { createReducer } from '@reduxjs/toolkit'

const initialState = {}

export const friendsPostsReducer = createReducer(initialState, {
    friendsPostsRequest: (state) => {
        state.loading = true;
    },
    friendsPostsSuccess: (state, action) => {
        state.loading = false
        state.posts = action.payload
    },
    friendsPostsFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    myPostsRequest: (state) => {
        state.loading = true;
    },
    myPostsSuccess: (state, action) => {
        state.loading = false
        state.posts = action.payload
    },
    myPostsFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    userPostsRequest: (state) => {
        state.loading = true;
    },
    userPostsSuccess: (state, action) => {
        state.loading = false
        state.posts = action.payload
    },
    userPostsFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    clearErrors: (state) => {
        state.error = null
    }
})

export const createPostReducer = createReducer(initialState, {
    createPostRequest: (state) => {
        state.loading = true;
    },
    createPostSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    createPostFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    updateCaptionRequest: (state) => {
        state.loading = true;
    },
    updateCaptionSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    updateCaptionFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    deletePostRequest: (state) => {
        state.loading = true;
    },
    deletePostSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    deletePostFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    likePostRequest: (state) => {
        state.loading = true;
    },
    likePostSuccess: (state, action) => {
        state.loading = false
    },
    likePostFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    searchUsersRequest: (state) => {
        state.loading = true;
    },
    searchUsersSuccess: (state, action) => {
        state.loading = false
    },
    searchUsersFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    clearErrors: (state) => {
        state.error = null
    },
    clearMessage: (state) => {
        state.message = null
    }
})

export const commentPostReducer = createReducer(initialState, {
    commentRequest: (state) => {
        state.loading = true;
    },
    commentSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    commentFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    deleteCommentRequest: (state) => {
        state.loading = true;
    },
    deleteCommentSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    deleteCommentFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    clearErrors: (state) => {
        state.error = null
    },
    clearMessage: (state) => {
        state.message = null
    }
})