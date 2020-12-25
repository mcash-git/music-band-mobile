import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setAuth: ['data'],
  setDeviceToken: ['deviceToken'],
  logout: null
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  token: null,
  refreshToken: null,
  user: null,
  deviceToken: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const setAuth = (state, { data }) =>
  state.merge({ ...data })

export const setDeviceToken = (state, { deviceToken }) =>
  state.merge({ deviceToken })

// request the data from an api
export const logout = (state) => state.merge({ token: null, refreshToken: null, user: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_AUTH]: setAuth,
  [Types.SET_DEVICE_TOKEN]: setDeviceToken,
  [Types.LOGOUT]: logout
})
