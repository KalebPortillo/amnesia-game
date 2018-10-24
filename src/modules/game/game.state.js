import firebase from 'react-native-firebase'

import update from 'immutability-helper'
import { addScore } from '../user/user.state'

const gamesRef = firebase.firestore().collection('games')
const roomsRef = firebase.firestore().collection('rooms')

let unsubscribe
let countdownTimeout

const cardList = [
  {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/php-logo_1.png',
    id: 1
  },
  {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/css3-logo.png',
    id: 2
  },
  {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/html5-logo.png',
    id: 3
  },
  {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/jquery-logo.png',
    id: 4
  },
  {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/js-logo.png',
    id: 5
  },
  {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/nodejs-logo.png',
    id: 6
  },
  {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/photoshop-logo.png',
    id: 7
  },
  {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/python-logo.png',
    id: 8
  },
  {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/rails-logo.png',
    id: 9
  },
  {
    img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sass-logo.png',
    id: 10
  }
]

// Initial state
const initialState = {
  cards: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  waiting: null,
  turn: null
}

// Actions
const SET = 'GameState/SET'
const WAITING = 'GameState/WAITING'
const OPPONENT = 'GameState/OPPONENT'
const RESET = 'GameState/RESET'
const COUNTDOWN = 'GameState/COUNTDOWN'

// const shuffleArray = arr =>
//   arr
//     .map(a => [Math.random(), a])
//     .sort((a, b) => a[0] - b[0])
//     .map(a => a[1])

const shuffleArray = arr => arr

// Action creators
export const setWaiting = waiting => ({
  type: WAITING,
  payload: waiting,
  turn: null
})

export const createRounds = roomRef => dispatch => {
  const rounds = []
  for (let i = 0; i < 3; i++) {
    const gameRef = gamesRef.doc()
    dispatch(createGame(gameRef))
    rounds.push(gameRef.id)
  }

  roomRef.update({
    rounds,
    roundIndex: 0
  })
}

export const createGame = gameRef => async (dispatch, getStore) => {
  const { user } = getStore()

  gameRef
    .set({
      gameId: gameRef.id,
      owner: user.uid,
      turn: user.uid,
      cards: shuffleArray([...cardList, ...cardList])
    })
    .then(() => {
      console.log('CREATE GAME', gameRef.id)
    })
    .catch(err => {
      console.log('CREATE GAME ERROR', err)
    })
}

export const setupGame = gameId => async (dispatch, getState) => {
  if (unsubscribe) {
    unsubscribe()
    dispatch({ type: RESET })
  }

  const gameDoc = gamesRef.doc(gameId)

  unsubscribe = gameDoc.onSnapshot(snapshot => {
    const { game: previousGame } = getState()
    const game = snapshot.data()

    console.log('ON GAME SNAPSHOT', game)

    if (previousGame.turn !== null && previousGame.turn !== game.turn && !game.finished) {
      dispatch(onTurnChanged())
    } else if (game.finished && !previousGame.finished) {
      dispatch(onRoundFinished(game))
    }

    dispatch({
      type: SET,
      payload: snapshot.data()
    })
  })

  dispatch(setCountdown(6))
}

export const updateCard = (card, index) => (dispatch, getState) => {
  dispatch(setWaiting(true))
  const { user, game } = getState()
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
      gamesRef
        .doc(gameId)
        .update({
          cards: updatedPickedCards
        })
        .then(() => {
          dispatch(setWaiting(false))

          if (cardsMatched && updatedPickedCards.filter(c => !c.matched).length === 0) {
            dispatch(finishRound())
          }
        })
    }, cardsMatched.matched ? 200 : 1000)
  } else {
    dispatch(setWaiting(false))
  }
}

export const changeTurn = () => (dispatch, getState) => {
  const { user, game, room } = getState()

  if (game.owner === user.uid) {
    gamesRef.doc(game.gameId).update({
      turn: game.turn === user.uid ? room.opponent.uid : user.uid
    })
  }
}

export const setCountdown = (count, callback = changeTurn) => dispatch => {
  if (count > -1) {
    dispatch({
      type: COUNTDOWN,
      payload: count
    })

    countdownTimeout = setTimeout(() => {
      dispatch(setCountdown(count - 1, callback))
    }, 1000)
  } else {
    dispatch(callback())
  }
}

const finishRound = () => (dispatch, getState) => {
  const { user, game, room } = getState()
  const { gameId, cards } = game
  const { roomId, scores, opponent, roundIndex } = room

  console.log('FINISH ROUND >>>>')

  const userMatchedCards = cards.filter(c => c.matched === user.uid)

  const myScore = userMatchedCards.length * 2 * (roundIndex + 1)
  const opponentScore = (cards.length - userMatchedCards.length) * 2 * (roundIndex + 1)

  gamesRef.doc(gameId).update({
    finished: true,
    scores: {
      [user.uid]: myScore,
      [opponent.uid]: opponentScore
    }
  })

  roomsRef.doc(roomId).update({
    scores: {
      [user.uid]: myScore + (scores[user.uid] || 0),
      [opponent.uid]: opponentScore + (scores[opponent.uid] || 0)
    }
  })
}

const changeRound = () => (dispatch, getState) => {
  const { room, user, game } = getState()
  const { roundIndex, roomId } = room

  if (user.uid === game.owner)
    roomsRef.doc(roomId).update({
      roundIndex: roundIndex + 1
    })
}

const nextRound = () => dispatch => {
  dispatch(setCountdown(6, changeRound))
}

const gameOver = () => (dispatch, getState) => {
  console.log('GAME OVER!!!!')
  const { room } = getState()
  roomsRef.doc(room.roomId).update({
    status: 'ended'
  })
}

const onTurnChanged = () => dispatch => {
  if (countdownTimeout) clearTimeout(countdownTimeout)

  dispatch(setCountdown(6))
}

const onRoundFinished = game => (dispatch, getState) => {
  clearTimeout(countdownTimeout)

  const { room, user } = getState()

  const score = game.scores[user.uid]
  dispatch(addScore(score))

  if (room.roundIndex === 2) {
    dispatch(gameOver())
  } else {
    dispatch(nextRound())
  }
}

// Reducer
export default (state = initialState, action = {}) => {
  switch (action.type) {
    case RESET:
      return initialState
    case SET:
      return { ...state, ...action.payload }
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
export const selectGame = state => state.game
export const selectCards = state => selectGame(state).cards
export const selectWaiting = state => selectGame(state).waiting
export const selectCountdown = state => selectGame(state).countdown
export const selectTurn = state => selectGame(state).turn
export const selectScores = state => selectGame(state).scores
export const selectFinished = state => selectGame(state).finished
