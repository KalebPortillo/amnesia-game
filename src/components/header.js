import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Colors, Metrics, Media, Fonts } from '../theme'

type Props = {
  title: string,
  style?: number | Object | Array<number>,
  textStyle?: number | Object | Array<number>
}

export default function Header(props: Props) {
  return (
    <View style={[styles.container, props.style]}>
      <Image resizeMode="contain" source={Media.icons.elephant} style={styles.logo} />
      <Text style={[styles.text, props.textStyle]}>{props.title.toUpperCase()}</Text>
    </View>
  )
}

Header.defaultProps = {
  style: undefined,
  textStyle: undefined
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Metrics.headerheight,
    width: Metrics.screenWidth,
    padding: Metrics.doubleBaseMargin,
    paddingBottom: 0
  },
  logo: {
    height: 35,
    width: 35
  },
  text: {
    color: Colors.greenLight,
    fontSize: Fonts.size.h5,
    fontWeight: 'bold'
  }
})
