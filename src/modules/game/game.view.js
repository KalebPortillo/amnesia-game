import React, { PureComponent } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { NavigationActions } from 'react-navigation'

import colors from '../../theme/colors'
import Header from '../../components/header'
import RoundCounter from '../../components/round-counter'
import { AppStyles, Colors } from '../../theme'
import { AwesomeButton } from '../../components'
import ranking from '../../utils/ranking'

type Props = {
  navigation: Object,
  user: Object,
  cards: Array,
  waiting: boolean,
  countdown: number,
  turn: string,
  opponent: Object,
  scores: Object,
  finished: boolean,
  round: number,
  updateCard: Function,
  totalScores: Array,
  ended: boolean
}
export default class Game extends PureComponent<Props> {
  getHeaderInfo = () => {
    const { user, countdown, opponent, scores, finished, turn } = this.props

    const myTurn = turn === user.uid

    return finished ? (
      <View style={{ alignItems: 'center' }}>
        <Text
          numberOfLines={2}
          style={{ color: Colors.white, fontSize: 10, textAlign: 'center', marginBottom: 5 }}
        >{`Voce conquistou`}</Text>
        <View style={{ padding: 5, backgroundColor: Colors.white, borderRadius: 3 }}>
          <Text style={{ color: Colors.greenLight, fontSize: 12 }}>{scores[user.uid]} PONTOS</Text>
        </View>
      </View>
    ) : (
      <View style={{ alignItems: 'center' }}>
        {myTurn || (
          <View>
            <Text style={{ color: Colors.white, fontSize: 10, textAlign: 'center' }}>
              Esperando jogada de
            </Text>
            <Text
              style={{ color: Colors.orange, fontSize: 10, textAlign: 'center', marginBottom: 5 }}
            >
              {opponent.name}
            </Text>
          </View>
        )}
        <RoundCounter count={countdown} size={myTurn ? 30 : 17} light />
      </View>
    )
  }

  handleCardPress = (card, index) => {
    this.props.updateCard(card, index)
  }

  gotToLobby = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })]
    })
    this.props.navigation.dispatch(resetAction)
  }

  render() {
    const {
      cards,
      waiting,
      user,
      countdown,
      opponent,
      turn,
      finished,
      round,
      ended,
      totalScores
    } = this.props
    const myTurn = turn === user.uid
    return (
      <View style={styles.container}>
        <Header
          title={`Round ${round + 1}`}
          middleComponent={this.getHeaderInfo()}
          style={{ backgroundColor: Colors.background }}
        />
        <View style={[styles.body, { borderColor: myTurn ? Colors.greenDark : Colors.orange }]}>
          {cards.map((card, i) => {
            const canShow = card.picked || !!card.matched
            return (
              <TouchableOpacity
                disabled={canShow || waiting || !myTurn}
                key={i}
                style={[styles.cardButton]}
                onPress={() => this.handleCardPress(card, i)}
              >
                <View style={styles.card}>
                  {canShow && (
                    <Image resizeMode="contain" source={{ uri: card.img }} style={[styles.card]} />
                  )}
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
                </View>
              </TouchableOpacity>
            )
          })}
          {finished && (
            <View
              style={{
                ...AppStyles.positionAbsolute,
                ...AppStyles.centerChild,
                backgroundColor: Colors.transparentDark
              }}
            >
              {!ended ? (
                <View style={AppStyles.centerChild}>
                  <Text style={{ color: Colors.white, fontSize: 20, marginBottom: 20 }}>
                    O proximo round comeca em:
                  </Text>
                  <RoundCounter count={countdown} size={80} />
                </View>
              ) : (
                <View style={AppStyles.centerChild}>
                  <Text style={{ color: Colors.white, fontSize: 12, marginBottom: 15 }}>
                    {totalScores[user.uid] > totalScores[opponent.uid]
                      ? 'Parabens! Voce venceu!'
                      : 'Voce perdeu :('}
                  </Text>
                  <View
                    style={{
                      padding: 5,
                      paddingHorizontal: 15,
                      backgroundColor: Colors.white,
                      borderRadius: 3
                    }}
                  >
                    <Text style={{ color: Colors.greenLight, fontSize: 15, fontWeight: 'bold' }}>
                      {totalScores[user.uid]} PONTOS TOTAIS
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ color: Colors.white, fontSize: 15 }}>Ranking:</Text>
                    <Text style={{ color: Colors.white, fontSize: 15, fontWeight: 'bold' }}>
                      {' '}
                      {ranking(user.score)}
                    </Text>
                  </View>
                  <AwesomeButton
                    onPress={this.gotToLobby}
                    text="Ir para Lobby"
                    style={{ marginTop: 50, paddingHorizontal: 20 }}
                  />
                </View>
              )}
            </View>
          )}
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
    flexWrap: 'wrap',
    borderWidth: 3,
    padding: 1,
    margin: 2
  },
  cardButton: {
    height: '20%',
    width: '25%',
    padding: 1
  },
  card: {
    flex: 1,
    backgroundColor: colors.greenLight
  }
}
