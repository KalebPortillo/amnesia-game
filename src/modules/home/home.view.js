import React, { Component } from 'react'
import { View, TextInput, Text } from 'react-native'
import { AwesomeButton } from '../../components'
import colors from '../../theme/colors'
import Header from '../../components/header'

type Props = {
  authenticationRequest: Function,
  createUser: Function,
  findRoom: Function,
  user: Object,
  room: Object
}
export default class Home extends Component<Props> {
  state = {
    name: ''
  }

  componentDidMount() {
    this.props.authenticationRequest()
  }

  startGame = () => {
    if (this.props.user.uid) {
      this.props.findRoom()
    } else {
      this.props.createUser(this.state.name)
    }
  }

  render() {
    const {
      user: { name, score },
      room: { waiting, opponent, countdown }
    } = this.props

    return (
      <View style={styles.container}>
        <Header title="Lobby" />
        <View style={styles.content}>
          {name ? (
            <View>
              <Text>Bem vindo {name}</Text>
              <Text>Nivel {score}</Text>
            </View>
          ) : (
            <TextInput
              style={{ height: 50, width: '90%' }}
              placeholder="Player name"
              onChangeText={text =>
                this.setState({
                  name: text
                })
              }
              value={this.state.name}
            />
          )}
          {waiting === null ? (
            <AwesomeButton onPress={this.startGame} text="START" />
          ) : (
            <Text>{waiting ? 'PROCURANDO OPONENTE...' : 'OPONENTE ENCONTRADO'}</Text>
          )}
          {opponent && (
            <View>
              <Text>VOCE LUTARA COM {opponent.name}</Text>
              <Text>Nivel {opponent.score}</Text>
              <Text>JOGO COMECA EM {countdown}</Text>
            </View>
          )}
        </View>
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background
  },
  content: {
    flex: 1
  }
}
