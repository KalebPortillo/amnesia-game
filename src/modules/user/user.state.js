import firebase from 'react-native-firebase'

import { findRoom } from '../room/room.state'

const ref = firebase.firestore().collection('users')

// Initial state
const initialState = {
  fetching: null,
  uid: null,
  name: null,
  ranking: []
}

// Actions
const SET = 'UserState/SET'
const RESET = 'UserState/RESET'
const FETCHING = 'UserState/FETCHING'
const RANKING = 'UserState/RANKING'

// Action creators
export const authenticationRequest = () => async dispatch => {
  const { user } = await firebase.auth().signInAnonymously()
  dispatch(setFetching(true))
  console.log('CREDENTIALS', user)

  if (user.displayName) {
    dispatch(retrieveUser(user.uid))
  } else {
    dispatch(setFetching(false))
  }
}

export const retrieveUser = uid => async dispatch => {
  ref
    .doc(uid)
    .get()
    .then(doc => {
      dispatch({
        type: SET,
        payload: doc.data()
      })
      dispatch(setFetching(false))
    })
    .catch(err => {
      console.log('ERROR GETTING USER: ', err)
    })
}

export const retrieveRanking = () => async dispatch => {
  ref
    .orderBy('score', 'desc')
    .get()
    .then(docs => {
      console.log('OPA', docs)
      const users = []
      docs.forEach(doc => users.push(doc.data()))
      dispatch({
        type: RANKING,
        payload: users
      })
    })
    .catch(err => {
      console.log('ERROR GETTING RANKING: ', err)
    })
}

export const createUser = name => async dispatch => {
  const anonymousUser = await firebase.auth().currentUser
  anonymousUser.updateProfile({
    displayName: name
  })

  const user = {
    name,
    uid: anonymousUser.uid,
    score: 0
  }
  ref
    .doc(anonymousUser.uid)
    .set(user)
    .then(() => {
      console.log('USER CREATED')
      dispatch({
        type: SET,
        payload: user
      })
      dispatch(findRoom())
    })
    .catch(err => {
      console.log('ERROR CREATING USER', err)
    })
}

export const addScore = score => (dispatch, getState) => {
  const { user } = getState()

  const updatedUser = { ...user, score: user.score + score }

  ref.doc(user.uid).update(updatedUser)

  dispatch({
    type: SET,
    payload: updatedUser
  })
}

export const setFetching = fetching => ({
  type: FETCHING,
  payload: fetching
})

// Reducer
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET:
      return { ...state, ...action.payload }
    case RESET:
      return initialState
    case FETCHING:
      return { ...state, fetching: action.payload }
    case RANKING:
      return { ...state, ranking: action.payload }
    default:
      return state
  }
}

// Selectors
export const selectUser = state => state.user
