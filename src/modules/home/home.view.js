import React, { Component } from 'react'
import { View, TextInput } from 'react-native'
import { AwesomeButton } from '../../components'

type Props = {
  authenticationRequest: Function,
  createUser: Function
}
export default class Home extends Component<Props> {
  state = {
    name: ''
  }

  componentDidMount() {
    this.props.authenticationRequest()
  }

  startGame = () => {
    this.props.createUser(this.state.name)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TextInput
          style={{ height: 50, width: '100%', backgroundColor: 'yellow' }}
          onChangeText={text =>
            this.setState({
              name: text
            })
          }
          value={this.state.name}
        />
        <AwesomeButton onPress={this.startGame} text="START" />
      </View>
    )
  }
}
