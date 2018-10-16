import React, { Component } from 'react'
import { View, TextInput, Text } from 'react-native'
import { AwesomeButton } from '../../components'

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
      room: { waiting, opponent }
    } = this.props

    return (
      <View style={styles.container}>
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
          </View>
        )}
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
}
