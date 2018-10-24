import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { Colors, Metrics, Fonts, AppStyles } from '../theme'
import colors from '../theme/colors'

type Props = {
  count: string,
  style?: number | Object | Array<number>,
  textStyle?: number | Object | Array<number>,
  size?: number,
  light?: boolean
}

export default function RoundCounter(props: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          height: props.size,
          width: props.size,
          borderRadius: props.size / 2,
          backgroundColor: props.light ? colors.white : colors.transparent
        },
        props.style
      ]}
    >
      <Text
        style={[
          { fontSize: props.size / 2, color: props.light ? colors.black : colors.white },
          props.textStyle
        ]}
      >
        {props.count}
      </Text>
    </View>
  )
}

RoundCounter.defaultProps = {
  style: undefined,
  textStyle: undefined,
  size: Metrics.roundCounter,
  light: false
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white
  }
})
