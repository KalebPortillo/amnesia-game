import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Colors, Metrics, Media, Fonts } from '../theme'

type Props = {
  title: string,
  style?: number | Object | Array<number>,
  textStyle?: number | Object | Array<number>,
  middleComponent?: Object
}

export default function Header(props: Props) {
  const { middleComponent } = props
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.left}>
        <Image resizeMode="contain" source={Media.icons.elephant} style={styles.logo} />
      </View>
      <View style={styles.middle}>{middleComponent}</View>
      <View style={styles.right}>
        <Text style={[styles.text, props.textStyle]}>{props.title.toUpperCase()}</Text>
      </View>
    </View>
  )
}

Header.defaultProps = {
  style: undefined,
  textStyle: undefined,
  middleComponent: <View />
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Metrics.headerHeight,
    width: Metrics.screenWidth,
    paddingHorizontal: Metrics.baseMargin,
    paddingTop: 20,
    paddingBottom: 0
  },
  left: {
    flex: 1,
    alignItems: 'flex-start'
  },
  middle: {
    flex: 2.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  right: {
    flex: 1,
    alignItems: 'flex-end'
  },
  logo: {
    height: 35,
    width: 35
  },
  text: {
    color: Colors.greenLight,
    fontSize: Fonts.size.regular,
    fontWeight: 'bold'
  }
})
