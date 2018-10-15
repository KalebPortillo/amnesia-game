import { combineReducers } from 'redux'
import NavigatorReducer from '../modules/navigator/navigator.state'
import UserReducer from '../modules/user/user.state'
// ## Generator Reducer Imports

export const reducers = {
  navigation: NavigatorReducer,
  user: UserReducer
}

export default combineReducers(reducers)
