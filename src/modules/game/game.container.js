import { connect } from 'react-redux'
import Game from './game.view'
import { updateCard, selectCards, selectWaiting } from './game.state'
import { selectUser } from '../user/user.state'

const mapStateToProps = state => ({
  user: selectUser(state),
  cards: selectCards(state),
  waiting: selectWaiting(state)
})

const mapActionsToProps = {
  updateCard
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Game)
