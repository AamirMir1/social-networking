export const friendsPosts = () => async (dispatch) => {
    try {
        dispatch({ type: "friendsPostsRequest" })
        let data = await fetch("/friends/posts", {
            credentials: "include"
        })
        data = await data.json()
        console.log(data.posts)
        if (data.success) {
            return dispatch({ type: "friendsPostsSuccess", payload: data.posts })
        } else {
            return dispatch({ type: "friendsPostsFailure", payload: data.error })
        }
    } catch (error) {
        dispatch({ type: "friendsPostsFailure", payload: error.response.data.message })
    }
}

export const createPost = (caption, image) => async (dispatch) => {
    try {
        dispatch({ type: "createPostRequest" })
        let data = await fetch("/upload/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                caption,
                image
            }),
            credentials: "include"
        })
        data = await data.json()
        if (data.success) {
            return dispatch({ type: "createPostSuccess", payload: data.message })
        } else {
            return dispatch({ type: "createPostFailure", payload: data.message })
        }
    } catch (error) {
        dispatch({ type: "createPostFailure", payload: error.response.data.message })
    }
}

export const likePosts = (id) => async (dispatch) => {
    try {
        dispatch({ type: "likePostRequest" })
        let data = await fetch(`/post/like/${id}`, {
            method: "POST",
            credentials: "include"
        })
        data = await data.json()
        if (data.success) {
            return dispatch({ type: "likePostSuccess" })
        } else {
            return dispatch({ type: "likePostFailure", payload: data.message })
        }
    } catch (error) {
        dispatch({ type: "likePostFailure", payload: error.response.data.message })
    }
}

export const commentOnPost = (id, comment) => async (dispatch) => {
    try {
        dispatch({ type: "commentRequest" })
        let data = await fetch(`/post/comment/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment
            }),
            credentials: "include"
        })
        data = await data.json()
        console.log(data)
        if (data.success) {
            return dispatch({ type: "commentSuccess", payload: data.message })
        } else {
            return dispatch({ type: "commentFailure", payload: data.message })
        }

    } catch (error) {
        dispatch({ type: "commentFailure", payload: error.response.data.message })
    }
}

export const deleteComment = (id, commentId) => async (dispatch) => {
    try {
        dispatch({ type: "deleteCommentRequest" })
        let data = await fetch(`/comment/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                commentId
            }),
            credentials: "include"
        })
        data = await data.json()
        if (data.success) {
            return dispatch({ type: "deleteCommentSuccess", payload: data.message })
        } else {
            return dispatch({ type: "deleteCommentFailure", payload: data.message })
        }
    } catch (error) {
        dispatch({ type: "deleteCommentFailure", payload: error.response.data.message })
    }
}
export const myPosts = () => async (dispatch) => {
    try {
        dispatch({ type: "myPostsRequest" })
        let data = await fetch(`/my/posts`, {
            credentials: "include"
        })
        data = await data.json()
        if (data.success) {
            return dispatch({ type: "myPostsSuccess", payload: data.posts })
        } else {
            return dispatch({ type: "myPostsFailure", payload: data.message })
        }
    } catch (error) {
        dispatch({ type: "myPostsFailure", payload: error.response.data.message })
    }
}
export const userPosts = (id) => async (dispatch) => {
    try {
        dispatch({ type: "userPostsRequest" })
        let data = await fetch(`/user/posts/${id}`, {
            credentials: "include"
        })
        data = await data.json()
        if (data.success) {
            return dispatch({ type: "userPostsSuccess", payload: data.posts })
        } else {
            return dispatch({ type: "userPostsFailure", payload: data.message })
        }
    } catch (error) {
        dispatch({ type: "userPostsFailure", payload: error.response.data.message })
    }
}
export const deleteMyPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: "deletePostRequest" })
        let data = await fetch(`/post/${id}`, {
            method: "DELETE",
            credentials: "include"
        })
        data = await data.json()
        if (data.success) {
            return dispatch({ type: "deletePostSuccess", payload: data.message })
        } else {
            return dispatch({ type: "deletePostFailure", payload: data.message })
        }
    } catch (error) {
        dispatch({ type: "deletePostFailure", payload: error.response.data.message })
    }
}
export const updatePostCaption = (id, caption) => async (dispatch) => {
    try {
        dispatch({ type: "updateCaptionRequest" })
        let data = await fetch(`/post/update/caption/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                caption
            }),
            credentials: "include"
        })
        data = await data.json()
        if (data.success) {
            return dispatch({ type: "updateCaptionSuccess", payload: data.message })
        } else {
            return dispatch({ type: "updateCaptionFailure", payload: data.message })
        }
    } catch (error) {
        dispatch({ type: "updateCaptionFailure", payload: error.response.data.message })
    }
}
