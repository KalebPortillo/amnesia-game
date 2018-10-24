import { combineReducers } from 'redux'
import NavigatorReducer from '../modules/navigator/navigator.state'
import UserReducer from '../modules/user/user.state'
import RoomReducer from '../modules/room/room.state'
import GameReducer from '../modules/game/game.state'
import DeckReducer from '../modules/deck/deck.state'
// ## Generator Reducer Imports

export const reducers = {
  navigation: NavigatorReducer,
  user: UserReducer,
  room: RoomReducer,
  game: GameReducer,
  deck: DeckReducer
}

export default combineReducers(reducers)
