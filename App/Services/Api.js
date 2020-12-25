// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import config from 'react-native-config'
// our "constructor"
const create = (baseURL = config.API_URL) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })

  const setToken = (token) => api.setHeader('Authorization', 'Bearer ' + token)

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const login = (email, password) => api.post('/auth/login', { email, password })
  const register = (user) => api.post('/auth/register', user)
  const refreshToken = (token) => api.post('/auth/refresh', { refresh_token: token })
  const getMe = () => api.get('/auth/me')

  const registerDeviceToken = (data) => api.post('/pushTokens', data)
  const removeDeviceToken = (token) => api.delete('/pushTokens', { device_token: token })

  const getUser = (id, query) => api.get(`/users/${id}`, { query })
  const updateUser = (id, data) => api.put(`/users/${id}`, data)
  const searchUsers = (query, search) => api.get(`/users/search`, { query, search })
  const getUsers = (query) => api.get(`/users`, { query })
  const getSuggestedUsers = (id, query, search) => api.get(`/users/suggested`, { query, search })
  const followUser = (id) => api.post(`/users/${id}/follow`)

  const getInstruments = () => api.get(`/instruments`)

  const addPost = (post) => api.post(`/posts`, post)
  const getPosts = (query) => api.get(`/posts`, { query })
  const likePost = (id, like) => api.post(`/posts/${id}/like`, { like })
  const getComments = (id, query) => api.get(`/posts/${id}/comments`, { query })
  const addComment = (id, text) => api.post(`/posts/${id}/comments`, { text })
  const getUserPosts = (id, query) => api.get(`/users/${id}/posts`, { query })
  const getUserBands = (id, query) => api.get(`/users/${id}/bands`, { query })

  const getSubComments = (id, query) => api.get(`/comments/${id}/comments`, { query })
  const addSubComment = (id, text) => api.post(`/comments/${id}/comments`, { text })

  const addAlbum = (album) => api.post(`/albums`, album)
  const getAlbums = (query) => api.get(`/albums`, { query })

  const addBand = (album) => api.post(`/bands`, album)
  const getBands = (query, search) => api.get(`/bands`, { query, search })
  const getBandMembers = (id, query) => api.get(`/bands/${id}/users`, { query })
  const getBandSongs = (id, query) => api.get(`/bands/${id}/songs`, { query })
  const inviteUser = (id, data) => api.post(`/bands/${id}/users`, data)
  const joinBand = (id) => api.post(`/bands/${id}/users/join`)
  const followBand = (id) => api.post(`/bands/${id}/follow`)

  const getSongs = (query, search) => api.get(`/songs`, { query, search })

  const getConversation = (type, target) => api.get(`/conversations/${type}/${target}`)
  const getConversations = (id, query) => api.get(`/users/${id}/conversations`, { query })
  const openConversation = (type, target) => api.post(`/conversations`, { type, target })
  const readConversation = (id) => api.post(`/conversations/${id}/read`)
  const sendMessage = (message) => api.post(`/messages`, message)
  const getMessages = (id, query) => api.get(`/conversations/${id}/messages`, { query })

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    setToken,
    // a list of the API functions from step 2
    login,
    register,
    refreshToken,
    getMe,

    registerDeviceToken,
    removeDeviceToken,

    getUser,
    updateUser,
    searchUsers,
    getUsers,
    getSuggestedUsers,
    followUser,

    getInstruments,

    addPost,
    getPosts,
    likePost,
    getComments,
    addComment,
    getUserPosts,
    getUserBands,

    getSubComments,
    addSubComment,

    addAlbum,
    getAlbums,

    addBand,
    getBands,
    getBandMembers,
    getBandSongs,
    inviteUser,
    joinBand,
    followBand,

    getSongs,

    getConversations,
    getConversation,
    openConversation,
    readConversation,
    getMessages,
    sendMessage
  }
}

// let's return back our create method as the default.
export default {
  create
}
