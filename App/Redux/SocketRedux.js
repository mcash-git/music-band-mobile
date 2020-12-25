import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openSocket: null,
  closeSocket: null,
  socketState: ['socketState'],
  newMessage: ['newMessage']
})

export const SocketTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  open: false,
  error: null,
  socketState: null,
  newMessage: null
})

/* ------------- Selectors ------------- */

export const openSocket = state => state.merge({ open: true })
export const closeSocket = state => state.merge({ open: false })
export const socketState = (state, { socketState }) => state.merge({ socketState, open: socketState === 'close' ? false : state.open })
export const newMessage = (state, { newMessage }) => state.merge({ newMessage })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.OPEN_SOCKET]: openSocket,
  [Types.CLOSE_SOCKET]: closeSocket,
  [Types.SOCKET_STATE]: socketState,
  [Types.NEW_MESSAGE]: newMessage
})
