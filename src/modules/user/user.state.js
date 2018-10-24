import firebase from 'react-native-firebase'

import { findRoom } from '../room/room.state'

const ref = firebase.firestore().collection('users')

// Initial state
const initialState = {
  fetching: false,
  uid: null,
  name: null
}

// Actions
const SET = 'UserState/SET'
const RESET = 'UserState/RESET'

// Action creators
export const authenticationRequest = () => async dispatch => {
  const { user } = await firebase.auth().signInAnonymously()
  console.log('CREDENTIALS', user)

  if (user.displayName) {
    dispatch(retrieveUser(user.uid))
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
    })
    .catch(err => {
      console.log('ERROR GETTING USER: ', err)
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

// Reducer
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET:
      return { ...state, ...action.payload }

    case RESET:
      return initialState

    default:
      return state
  }
}

// Selectors
export const selectUser = state => state.user
