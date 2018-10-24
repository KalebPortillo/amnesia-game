import { connect } from 'react-redux'
import Game from './game.view'
import {
  setCountdown,
  updateCard,
  selectCards,
  selectWaiting,
  selectCountdown,
  selectTurn,
  selectFinished,
  selectScores
} from './game.state'
import { selectUser } from '../user/user.state'
import {
  selectOpponent,
  selectRound,
  selectScores as selectTotalScores,
  selectEnded
} from '../room/room.state'

const mapStateToProps = state => ({
  user: selectUser(state),
  cards: selectCards(state),
  waiting: selectWaiting(state),
  countdown: selectCountdown(state),
  opponent: selectOpponent(state),
  turn: selectTurn(state),
  finished: selectFinished(state),
  scores: selectScores(state),
  round: selectRound(state),
  totalScores: selectTotalScores(state),
  ended: selectEnded(state)
})

const mapActionsToProps = {
  updateCard,
  setCountdown
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Game)
