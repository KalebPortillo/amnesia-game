import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Animated, Easing } from 'react-native'
import FastImage from 'react-native-fast-image'

import { AppStyles, Colors } from '../../theme'

type Props = {
  user: Object,
  card: Object,
  turn: string,
  opponent: Object,
  onCardPress: Function
}
export default class Card extends Component<Props> {
  componentWillReceiveProps(nextProps) {
    const { card } = this.props
    const canShow = card.picked || !!card.matched
    const canShowNext = nextProps.card.picked || !!nextProps.card.matched

    if (canShow !== canShowNext) {
      console.log('MUDOU CANSHOW', card.id, canShowNext)
      this.rotateCard(canShowNext)
    }
  }

  shouldComponentUpdate(nextProps) {
    const { card, turn } = this.props

    return (
      card.picked !== nextProps.card.picked ||
      card.matched !== nextProps.card.matched ||
      card.img !== nextProps.card.img ||
      turn !== nextProps.turn
    )
  }

  animateValue = new Animated.Value(0)

  rotateCard = open => {
    Animated.timing(this.animateValue, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  opacityInterpolate = () => {
    return this.animateValue.interpolate({
      inputRange: [0, 0.49, 0.5, 1],
      outputRange: [0, 0, 1, 1]
    })
  }

  rotateInterpolate = () => {
    return this.animateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '0deg']
    })
  }

  render() {
    const { card, user, opponent, turn, onCardPress } = this.props
    const myTurn = turn === user.uid
    const canShow = card.picked || !!card.matched
    return (
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={0}
        disabled={canShow || !myTurn}
        style={[styles.cardButton]}
        onPressIn={onCardPress}
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: Colors.greenLight, opacity: myTurn || card.matched ? 1 : 0.4 },
            {
              transform: [{ rotateY: this.rotateInterpolate() }, { perspective: 800 }]
            }
          ]}
        >
          <Animated.View style={{ flex: 1, opacity: this.opacityInterpolate() }}>
            <FastImage
              resizeMode="contain"
              source={{ uri: card.img || 'url' }}
              style={[styles.card]}
            />
          </Animated.View>

          {card.matched && (
            <View
              style={{
                ...AppStyles.positionAbsolute,
                backgroundColor: Colors.transparentDark,
                ...AppStyles.centerChild,
                paddingHorizontal: 10
              }}
            >
              <Text
                style={{
                  color: card.matched === user.uid ? Colors.greenLight : Colors.orange,
                  textAlign: 'center'
                }}
              >
                {card.matched === user.uid ? user.name : opponent.name}
              </Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const styles = {
  cardButton: {
    height: '20%',
    width: '25%',
    padding: 1
  },
  card: {
    flex: 1
  }
}
