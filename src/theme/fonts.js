import { Platform } from 'react-native'

const type = {
  opensans: Platform.select({ android: 'opensans-regular', ios: 'Open Sans' }),
  raleway: Platform.select({ android: 'raleway-regular', ios: 'Raleway' }),
  roboto: Platform.select({ android: 'roboto-regular', ios: 'Roboto' })
}

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  input: 18,
  regular: 17,
  medium: 14,
  small: 12,
  tiny: 8.5
}

const style = {
  h1: {
    fontFamily: type.raleway,
    fontSize: size.h1
  },
  h2: {
    fontFamily: type.roboto,
    fontWeight: 'bold',
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.roboto,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.roboto,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.roboto,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.roboto,
    fontSize: size.h6
  },
  normal: {
    fontFamily: type.roboto,
    fontSize: size.regular
  },
  description: {
    fontFamily: type.roboto,
    fontSize: size.medium
  }
}

export default {
  type,
  size,
  style
}
