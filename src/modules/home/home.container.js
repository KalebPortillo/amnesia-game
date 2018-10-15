import { connect } from 'react-redux'
import Profile from './home.view'
import { authenticationRequest, createUser, selectUser } from '../user/user.state'

const mapStateToProps = state => ({
  user: selectUser(state)
})

const mapActionsToProps = {
  authenticationRequest,
  createUser
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Profile)
