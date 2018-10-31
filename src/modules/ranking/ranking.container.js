import { connect } from 'react-redux'
import Ranking from './ranking.view'
import { retrieveRanking, selectUser } from '../user/user.state'

const mapStateToProps = state => ({
  user: selectUser(state)
})

const mapActionsToProps = {
  retrieveRanking
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Ranking)
