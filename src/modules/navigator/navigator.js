import { StackNavigator } from 'react-navigation'
import { Easing, Animated } from 'react-native'

import Home from '../home/home.container'
import Game from '../game/game.container'

const transitionConfig = () => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
    useNativeDriver: true
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps

    const thisSceneIndex = scene.index
    const width = layout.initWidth

    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    })

    return { transform: [{ translateX }] }
  }
})

// Root navigator is a StackNavigator
const Navigator = StackNavigator(
  {
    Home: { screen: Home },
    Game: { screen: Game }
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'Home',
    transitionConfig,
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default Navigator
