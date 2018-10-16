import { connect } from 'react-redux'
import Profile from './home.view'
import { authenticationRequest, createUser, selectUser } from '../user/user.state'
import { findRoom, selectRoom } from '../room/room.state'

const mapStateToProps = state => ({
  user: selectUser(state),
  room: selectRoom(state)
})

const mapActionsToProps = {
  authenticationRequest,
  createUser,
  findRoom
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Profile)
