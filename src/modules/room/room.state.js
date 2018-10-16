import firebase from 'react-native-firebase'

const roomsRef = firebase.firestore().collection('rooms')
const usersRef = firebase.firestore().collection('users')

// Initial state
const initialState = {
  opponent: null,
  waiting: null
}

// Actions
const SET = 'GameState/SET'
const WAITING = 'GameState/WAITING'
const OPPONENT = 'GameState/OPPONENT'
const RESET = 'GameState/RESET'

// Action creators
export const findRoom = () => async dispatch => {
  dispatch(setWaiting(true))

  roomsRef
    .where('status', '==', 'waiting')
    .get()
    .then(querySnapshot => {
      const { docs } = querySnapshot
      console.log('FIND ROOM', querySnapshot.docs)
      if (docs.length < 1) {
        dispatch(createRoom())
      } else {
        dispatch(enterRoom(docs[0]))
      }
    })
    .catch(err => {
      console.log('FIND ROOM ERROR', err)
    })
}

export const createRoom = () => async dispatch => {
  roomsRef
    .add({
      status: 'waiting',
      players: []
    })
    .then(async docRef => {
      const docSnapshot = await docRef.get()
      console.log('CREATE ROOM', docSnapshot)
      dispatch(enterRoom(docSnapshot))
    })
    .catch(err => {
      console.log('CREATE ROOM ERROR', err)
    })
}
export const enterRoom = room => async (dispatch, getStore) => {
  const { user } = getStore()
  const docRef = roomsRef.doc(room.id)
  console.log('ENTER ROOM', docRef)
  docRef.onSnapshot(doc => {
    console.log('ON ROOM CHANGE', doc.data())
    // console.log('ON ROOM CHANGE AFTER >>>>', doc.data())
    const { players, status } = doc.data()
    if (players.length > 1 && status === 'waiting') {
      docRef.update({
        status: 'playing'
      })
    } else if (status === 'playing') {
      console.log('JOGANDO >>>>>>>>>>>>')
      dispatch(setWaiting(false))
      dispatch(setOpponent(players.find(p => p !== user.uid)))
    }
  })

  docRef.update({
    players: [...room.data().players, user.uid]
  })
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
    default:
      return state
  }
}

// Selectors
export const selectRoom = state => state.room
