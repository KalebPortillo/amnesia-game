import React, { PureComponent } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'

type Props = {
  user: Object,
  cards: Array,
  updateCard: Function,
  setCountdown: Function,
  waiting: boolean,
  countdown: number,
  turn: string,
  opponent: Object,
  scores: Object,
  finished: boolean
}
export default class Game extends PureComponent<Props> {
  handleCardPress = (card, index) => {
    this.props.updateCard(card, index)
  }

  render() {
    const { cards, waiting, user, countdown, opponent, turn, scores, finished } = this.props
    const myTurn = turn === user.uid
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {finished ? (
            <View>
              <Text>{`Voce ganhou ${scores[user.uid]} pontos`}</Text>
              <Text>Proximo round comeca em {countdown}</Text>
            </View>
          ) : (
            <View>
              <Text>{myTurn ? 'SUA VEZ DE JOGAR' : `VEZ DO ${opponent.name}`}</Text>
              <Text>{countdown}</Text>
            </View>
          )}
        </View>
        <View style={styles.body}>
          {cards.map((card, i) => {
            const canShow = card.picked || !!card.matched
            const backgroundColor = card.matched === user.uid ? 'blue' : 'red'
            return (
              <TouchableOpacity
                disabled={canShow || waiting || !myTurn}
                key={i}
                style={[styles.cardButton]}
                onPress={() => this.handleCardPress(card, i)}
              >
                {canShow ? (
                  <Image
                    resizeMode="contain"
                    source={{ uri: card.img }}
                    style={[styles.card, card.matched && { backgroundColor }]}
                  />
                ) : (
                  <View style={styles.card} />
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1
  },
  header: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    flex: 10,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  cardButton: {
    height: '20%',
    width: '25%',
    padding: 1
  },
  card: {
    flex: 1,
    backgroundColor: '#999'
  }
}
