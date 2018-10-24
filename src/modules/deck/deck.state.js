import firebase from 'react-native-firebase'

const ref = firebase.firestore().collection('decks')

// Initial state
const initialState = {
  fetching: false
}

// Actions
const SET = 'DeckState/SET'
const RESET = 'DeckState/RESET'

// Action creators
export const retrieveDecks = () => async dispatch => {
  const decks = []
  ref
    .get()
    .then(docs => {
      docs.forEach(doc => decks.push(doc.data().cards))
      dispatch({
        type: SET,
        payload: decks
      })
    })
    .catch(err => {
      console.log('ERROR GETTING USER: ', err)
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
// export const se = state => state.user
