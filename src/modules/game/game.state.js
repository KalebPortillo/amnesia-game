import firebase from 'react-native-firebase'

import update from 'immutability-helper'

const gamesRef = firebase.firestore().collection('games')
const usersRef = firebase.firestore().collection('users')

const cardList = [
  {
    name: 'php',
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/php-logo_1.png',
    id: 1
  },
  {
    name: 'css3',
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/css3-logo.png',
    id: 2
  },
  {
    name: 'html5',
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/html5-logo.png',
    id: 3
  },
  {
    name: 'jquery',
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/jquery-logo.png',
    id: 4
  },
  {
    name: 'javascript',
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/js-logo.png',
    id: 5
  },
  {
    name: 'node',
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/nodejs-logo.png',
    id: 6
  },
  {
    name: 'photoshop',
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/photoshop-logo.png',
    id: 7
  },
  {
    name: 'python',
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/python-logo.png',
    id: 8
  },
  {
    name: 'rails',
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/rails-logo.png',
    id: 9
  },
  {
    name: 'sass',
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sass-logo.png',
    id: 10
  }
]

// Initial state
const initialState = {
  cards: [],
  waiting: null
}

// Actions
const SET = 'GameState/SET'
const WAITING = 'GameState/WAITING'
const OPPONENT = 'GameState/OPPONENT'
const RESET = 'GameState/RESET'

const shuffleArray = arr =>
  arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1])

// Action creators
export const setWaiting = waiting => ({
  type: WAITING,
  payload: waiting
})

export const createGame = roomRef => async (dispatch, getStore) => {
  const { user } = getStore()
  gamesRef
    .add({
      owner: user.uid,
      cards: shuffleArray([...cardList, ...cardList])
    })
    .then(async docRef => {
      console.log('CREATE GAME', docRef.id)
      docRef.update({
        gameId: docRef.id
      })
      roomRef.update({
        gameId: docRef.id
      })
    })
    .catch(err => {
      console.log('CREATE GAME ERROR', err)
    })
}

export const startGame = gameId => async (dispatch, getStore) => {
  console.log('JOGANDO >>>>>>>>>>>>')
  gamesRef.doc(gameId).onSnapshot(snapshot => {
    console.log('ON GAME SNAPSHOT', snapshot.data())
    dispatch({
      type: SET,
      payload: snapshot.data()
    })
  })
}

export const updateCard = (card, index) => (dispatch, getStore) => {
  dispatch(setWaiting(true))
  const { user, game } = getStore()
  const { gameId, cards } = game

  const previousPickedIndex = cards.findIndex(c => c.picked)

  const updatedCards = update(cards, {
    [index]: { $set: { ...cards[index], picked: true } }
  })

  gamesRef.doc(gameId).update({
    cards: updatedCards
  })

  if (previousPickedIndex !== -1) {
    const cardsMatched =
      updatedCards[index].id === updatedCards[previousPickedIndex].id ? { matched: user.uid } : {}

    const updatedPickedCards = update(cards, {
      [index]: { $set: { ...cards[index], picked: false, ...cardsMatched } },
      [previousPickedIndex]: {
        $set: { ...cards[previousPickedIndex], picked: false, ...cardsMatched }
      }
    })

    setTimeout(() => {
      gamesRef.doc(gameId).update({
        cards: updatedPickedCards
      })
      dispatch(setWaiting(false))

      if (cardsMatched && updatedPickedCards.filter(c => !c.matched).length === 0) {
        console.log('ACABOU ROUND >>>>', updatedPickedCards)
      }
    }, cardsMatched.matched ? 200 : 1000)
  } else {
    dispatch(setWaiting(false))
  }
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
export const selectGame = state => state.game
export const selectCards = state => selectGame(state).cards
export const selectWaiting = state => selectGame(state).waiting
