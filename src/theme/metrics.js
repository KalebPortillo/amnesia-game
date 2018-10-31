import { Dimensions, Platform, StatusBar } from 'react-native'

const { width, height } = Dimensions.get('window')

// Used via Metrics.baseMargin
export default {
  marginHorizontal: 10,
  marginVertical: 10,
  smallMargin: 5,
  baseMargin: 10,
  doubleBaseMargin: 20,
  section: 25,
  doubleSection: 50,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: Platform.select({ ios: 22, android: StatusBar.currentHeight }),
  headerHeight: 90,
  buttonRadius: 5,
  buttonBorder: 2,
  roundCounter: 60,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  }
}
