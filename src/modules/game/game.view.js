import React, { PureComponent } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'

type Props = {
  user: Object,
  cards: Array,
  updateCard: Function,
  waiting: boolean
}
export default class Game extends PureComponent<Props> {
  handleCardPress = (card, index) => {
    this.props.updateCard(card, index)
  }

  render() {
    const { cards, waiting, user } = this.props
    return (
      <View style={styles.container}>
        {cards.map((card, i) => {
          const canShow = card.picked || !!card.matched
          const backgroundColor = card.matched === user.uid ? 'blue' : 'red'
          return (
            <TouchableOpacity
              disabled={canShow || waiting}
              key={i}
              style={[styles.cardButton, card.matched && { backgroundColor }]}
              onPress={() => this.handleCardPress(card, i)}
            >
              <Image
                source={{
                  uri: canShow
                    ? card.img
                    : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/codepen-logo.png'
                }}
                style={[styles.card]}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  cardButton: {
    height: '20%',
    width: '25%'
  },
  card: {
    flex: 1,
    resizeMode: 'contain'
  }
}
