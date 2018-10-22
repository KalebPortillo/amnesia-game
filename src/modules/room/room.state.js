import firebase from 'react-native-firebase'

import { NavigationActions } from 'react-navigation'
import { setupGame, createRounds } from '../game/game.state'

const roomsRef = firebase.firestore().collection('rooms')
const usersRef = firebase.firestore().collection('users')

// Initial state
const initialState = {
  opponent: null,
  waiting: null,
  countdown: 0,
  roundIndex: 0
}

// Actions
const SET = 'RoomState/SET'
const WAITING = 'RoomState/WAITING'
const OPPONENT = 'RoomState/OPPONENT'
const COUNTDOWN = 'RoomState/COUNTDOWN'
const RESET = 'RoomState/RESET'

// Action creators
export const findRoom = () => async dispatch => {
  dispatch(setWaiting(true))

  roomsRef
    .where('status', '==', 'waiting')
    .get()
    .then(querySnapshot => {
      const { docs } = querySnapshot
      console.log('FIND ROOM', querySnapshot)
      if (docs.length < 1) {
        dispatch(createRoom())
      } else {
        dispatch(enterRoom(docs[0].ref))
      }
    })
    .catch(err => {
      console.log('FIND ROOM ERROR', err)
    })
}

export const createRoom = () => async (dispatch, getStore) => {
  const { user } = getStore()

  const roomRef = roomsRef.doc()
  roomRef
    .set({
      owner: user.uid,
      status: 'waiting',
      players: [],
      roomId: roomRef.id
    })
    .then(async () => {})
    .catch(err => {
      console.log('CREATE ROOM ERROR', err)
    })

  dispatch(createRounds(roomRef))
  dispatch(enterRoom(roomRef))
}

export const enterRoom = roomRef => async (dispatch, getStore) => {
  const { user } = getStore()

  roomRef.onSnapshot(doc => {
    console.log('ON ROOM CHANGE', doc.data())
    const previousRoom = getStore().room
    const { players, status, rounds, roundIndex } = doc.data()

    // UPDATE ROOM STATE DATA
    dispatch({
      type: SET,
      payload: doc.data()
    })

    // CHECK IF ANOTHER PLAYER ENTERED THE ROOM AND SET ROOM TO PLAYING
    if (players.length > 1 && status === 'waiting') {
      roomRef.update({
        status: 'playing'
      })
      // AFTER ROOM UPDATE STATUS TO PLAYING COUNTDOWN AND GAME
    } else if (status === 'playing' && roundIndex === 0) {
      dispatch(setOpponent(players.find(p => p !== user.uid)))
      dispatch(
        setCountdown(3, () => {
          dispatch(setupGame(rounds[roundIndex]))
        })
      )
      dispatch(setWaiting(false))

      //  Check IF ROUND INDEX CHANGE AND START NEW ROUND
    } else if (roundIndex !== previousRoom.roundIndex) {
      if (roundIndex < 3) {
        dispatch(setupGame(rounds[roundIndex]))
        console.log('PROCEED TO CHANGE ROUND >>>>>>')
      }
    }
  })

  const roomSnap = await roomRef.get()
  roomRef.update({
    players: [...roomSnap.data().players, user.uid]
  })
}

const setCountdown = (count, callback) => dispatch => {
  if (count > -1) {
    dispatch({
      type: COUNTDOWN,
      payload: count
    })

    setTimeout(() => {
      dispatch(setCountdown(count - 1, callback))
    }, 1000)
  } else {
    callback()
    dispatch(NavigationActions.navigate({ routeName: 'Game' }))
  }
}

export const setWaiting = waiting => ({
  type: WAITING,
  payload: waiting
})

export const setOpponent = opponentId => async dispatch => {
  const userDoc = await usersRef.doc(opponentId).get()

  dispatch({
    type: OPPONENT,
    payload: userDoc.data()
  })
}

// Reducer
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET:
      return { ...state, ...action.payload }
    case RESET:
      return initialState
    case WAITING:
      return { ...state, waiting: action.payload }
    case OPPONENT:
      return { ...state, opponent: action.payload }
    case COUNTDOWN:
      return { ...state, countdown: action.payload }
    default:
      return state
  }
}

// Selectors
export const selectRoom = state => state.room
export const selectOpponent = state => selectRoom(state).opponent
