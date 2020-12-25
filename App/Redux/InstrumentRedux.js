import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setInstruments: ['instruments']
})

export const InstrumentTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  instruments: []
})

/* ------------- Selectors ------------- */

export const InstrumentSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const setInstruments = (state, { instruments }) =>
  state.merge({ instruments })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_INSTRUMENTS]: setInstruments
})
