import { createReducer } from '@reduxjs/toolkit'
const initialState = {
    isAuthenticated: false,
}

export const customReducer = createReducer(initialState, {
    registerRequest: (state) => {
        state.loading = true;
    },
    registerSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    registerFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    updatePasswordRequest: (state) => {
        state.loading = true;
    },
    updatePasswordSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    updatePasswordFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    unfriendRequest: (state) => {
        state.loading = true;
    },
    unfriendSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    unfriendFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    deleteRequest: (state) => {
        state.loading = true;
    },
    deleteSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    deleteFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    deleteAccountRequest: (state) => {
        state.loading = true;
    },
    deleteAccountSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    deleteAccountFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    unsendRequestRequest: (state) => {
        state.loading = true;
    },
    unsendRequestSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    unsendRequestFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    logoutRequest: (state) => {
        state.loading = true;
    },
    logoutSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    logoutFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    loginRequest: (state) => {
        state.loading = true;
    },
    loginSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    loginFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    acceptRequest: (state) => {
        state.loading = true;
    },
    acceptSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    acceptFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    sendFriendRequestRequest: (state) => {
        state.loading = true;
    },
    sendFriendRequestSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    sendFriendRequestFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    updateProfileRequest: (state) => {
        state.loading = true;
    },
    updateProfileSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    updateProfileFailure: (state, action) => {
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

export const loadUser = createReducer(initialState, {
    userProfileRequest: (state) => {
        state.loading = true;
        state.isAuthenticated = false
    },
    userProfileSuccess: (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
    },
    userProfileFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    }

})

export const searchAUser = createReducer(initialState, {
    searchRequest: (state) => {
        state.loading = true;
    },
    searchSuccess: (state, action) => {
        state.loading = false
        state.users = action.payload
    },
    searchFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    clearErrors: (state) => {
        state.error = null
    }
})

export const addFriendsReducer = createReducer(initialState, {
    getFriendsToAddRequest: (state) => {
        state.loading = true;
    },
    getFriendsToAddSuccess: (state, action) => {
        state.loading = false
        state.users = action.payload
    },
    getFriendsToAddFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    clearErrors: (state) => {
        state.error = null
    }
})

export const getUserReducer = createReducer(initialState, {
    getUserRequest: (state) => {
        state.loading = true;
    },
    getUserSuccess: (state, action) => {
        state.loading = false
        state.user = action.payload
    },
    getUserFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    clearErrors: (state) => {
        state.error = null
    }
})

export const resetPasswordReducer = createReducer(initialState, {
    sendTokenRequest: (state) => {
        state.loading = true;
    },
    sendTokenSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    sendTokenFailure: (state, action) => {
        state.loading = false
        state.error = action.payload
    },
    resetPasswordRequest: (state) => {
        state.loading = true;
    },
    resetPasswordSuccess: (state, action) => {
        state.loading = false
        state.message = action.payload
    },
    resetPasswordFailure: (state, action) => {
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