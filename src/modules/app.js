import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { PersistGate } from 'redux-persist/es/integration/react'

import SplashScreen from 'react-native-splash-screen'

import { Colors } from '../theme'
import { Loader } from '../components'

// import configureStore from '../redux/store'
import Navigator from './navigator/navigator.container'
import { authenticationRequest } from './user/user.state'

// const { store, persistor } = configureStore()
type Props = {
  persistor: Object,
  dispatch: Function
}
export default class App extends Component<Props> {
  componentDidMount() {
    SplashScreen.hide()
    this.props.dispatch(authenticationRequest())
  }

  render() {
    return (
      <PersistGate persistor={this.props.persistor} loading={<Loader />}>
        <StatusBar backgroundColor={Colors.transparent} barStyle="light-content" translucent />
        <Navigator />
      </PersistGate>
    )
  }
}
