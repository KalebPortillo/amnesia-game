import { combineReducers } from 'redux'
import NavigatorReducer from '../modules/navigator/navigator.state'
import UserReducer from '../modules/user/user.state'
import RoomReducer from '../modules/room/room.state'
// ## Generator Reducer Imports

export const reducers = {
  navigation: NavigatorReducer,
  user: UserReducer,
  room: RoomReducer
}

export default combineReducers(reducers)
