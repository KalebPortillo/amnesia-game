import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts, AppStyles } from '../theme'

type Props = {
  onPress: Function,
  text: string,
  style?: number | Object | Array<number>,
  textStyle?: number | Object | Array<number>,
  disabled?: boolean
}

export default function AwesomeButton(props: Props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.container, props.style]}
      disabled={props.disabled}
    >
      <Text style={[styles.text, props.textStyle]}>{props.text.toUpperCase()}</Text>
    </TouchableOpacity>
  )
}

AwesomeButton.defaultProps = {
  style: undefined,
  textStyle: undefined,
  disabled: false
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: Metrics.doubleSection,
    minWidth: Metrics.doubleSection * 2,
    padding: Metrics.baseMargin,
    backgroundColor: Colors.greenLight,
    borderRadius: Metrics.doubleSection / 2,
    ...AppStyles.centerChild
  },
  text: {
    ...Fonts.style.normal,
    color: Colors.white
  }
})
