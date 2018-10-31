import firebase from 'react-native-firebase'

import { NavigationActions } from 'react-navigation'
import { setupGame, createRounds } from '../game/game.state'

const roomsRef = firebase.firestore().collection('rooms')
const usersRef = firebase.firestore().collection('users')

// Initial state
const initialState = {
  opponent: {},
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

let unsubscribe = null
let findRoomTimeout = null

// Action creators
export const findRoom = () => async (dispatch, getState) => {
  dispatch(setWaiting(true))

  const { user } = getState()

  roomsRef
    .where('status', '==', 'waiting')
    .get()
    .then(querySnapshot => {
      const { docs } = querySnapshot
      if (docs.length < 1) {
        dispatch(createRoom())
      } else {
        const { players } = docs[0].data()
        if (!players.includes(user.uid)) {
          dispatch(enterRoom(docs[0].ref))
          dispatch(subscribeRoom(docs[0].ref))
        } else {
          dispatch(subscribeRoom(docs[0].ref))
          findRoomTimeout = setTimeout(() => dispatch(findRoom()), 4000)
        }
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
      roomId: roomRef.id,
      scores: []
    })
    .then(async () => {})
    .catch(err => {
      console.log('CREATE ROOM ERROR', err)
    })

  dispatch(createRounds(roomRef))
  dispatch(enterRoom(roomRef))
  dispatch(subscribeRoom(roomRef))
}

export const subscribeRoom = roomRef => async (dispatch, getStore) => {
  const { user } = getStore()

  if (unsubscribe) unsubscribe()

  unsubscribe = roomRef.onSnapshot(doc => {
    const previousRoom = getStore().room
    const { players, status, rounds, roundIndex } = doc.data()

    // UPDATE ROOM STATE DATA
    dispatch({
      type: SET,
      payload: doc.data()
    })

    // CHECK IF ANOTHER PLAYER ENTERED THE ROOM AND SET ROOM TO PLAYING
    if (players.length > 1 && status === 'waiting') {
      if (findRoomTimeout) clearTimeout(findRoomTimeout)
      roomRef.update({
        status: 'starting'
      })
      // AFTER ROOM UPDATE STATUS TO PLAYING COUNTDOWN AND GAME
    } else if (status === 'starting') {
      dispatch(setOpponent(players.find(p => p !== user.uid)))
      dispatch(
        setCountdown(5, () => {
          dispatch(setupGame(rounds[roundIndex]))
        })
      )
      dispatch(setWaiting(false))
      roomRef.update({
        status: 'playing'
      })
      //  Check IF ROUND INDEX CHANGE AND START NEW ROUND
    } else if (roundIndex !== previousRoom.roundIndex) {
      if (roundIndex < 3) {
        dispatch(setupGame(rounds[roundIndex]))
      }
    }
  })
}

export const enterRoom = roomRef => async (dispatch, getStore) => {
  const { user } = getStore()

  const roomSnap = await roomRef.get()
  roomRef.update({
    players: [...roomSnap.data().players, user.uid]
  })
}

const setCountdown = (count, callback) => dispatch => {
  if (count > 0) {
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

export const reset = () => ({
  type: RESET
})

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
export const selectRound = state => selectRoom(state).roundIndex
export const selectScores = state => selectRoom(state).scores
export const selectEnded = state => selectRoom(state).status === 'ended'
