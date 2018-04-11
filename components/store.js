import {createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'
import thunks from 'redux-thunk'
import axios from 'axios'

const initialState = {
  pugs: [],
  error: {}
}

export const gotPugs = pugs => ({type: 'GOT_PUGS', pugs})
export const gotError = error => ({type: 'GOT_ERROR', error})

export const fetchPugs = () => (dispatch, getState, {axios}) => {
  return axios.get('/api/pugs')
    .then(res => res.data)
    .then(pugs => {
      dispatch(gotPugs(pugs))
    })
    .catch(err => {
      dispatch(gotError(err))
    })
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GOT_PUGS':
      return {
        ...state,
        pugs: action.pugs
      }
    case 'GOT_ERROR':
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}

const store = createStore(
  reducer,
  applyMiddleware(
    logger,
    thunks
      .withExtraArgument({axios})
  )
)

export default store
