import React, { Component } from 'react'
import { View, TextInput, Text, ActivityIndicator, Image } from 'react-native'
import { Colors, Media } from '../../theme'
import { AwesomeButton } from '../../components'
import Header from '../../components/header'
import RoundCounter from '../../components/round-counter'
import ranking from '../../utils/ranking'

type Props = {
  reset: Function,
  createUser: Function,
  findRoom: Function,
  user: Object,
  room: Object,
  navigation: Object
}
export default class Home extends Component<Props> {
  state = {
    name: ''
  }

  componentDidMount() {
    this.props.reset()
  }

  startGame = () => {
    if (this.props.user.uid) {
      this.props.findRoom()
    } else {
      this.props.createUser(this.state.name)
    }
  }

  render() {
    const {
      user: { name, score, fetching },
      room: { waiting, opponent, countdown }
    } = this.props

    return (
      <View style={styles.container}>
        <Header title="Lobby" />
        <View style={styles.content}>
          <View style={styles.playerInfo}>
            {fetching ? (
              <ActivityIndicator size="large" color={Colors.white} />
            ) : (
              <View>
                {name ? (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, marginBottom: 5 }}>Olá {name}</Text>
                    <Text style={{ fontSize: 18, color: Colors.white, fontWeight: 'bold' }}>
                      {ranking(score)}
                    </Text>
                    <Text style={{ fontSize: 15, color: Colors.white }}>{score} pontos</Text>
                  </View>
                ) : (
                  <View
                    style={{ borderWidth: 1, borderColor: Colors.black, paddingHorizontal: 10 }}
                  >
                    <TextInput
                      style={{ height: 50, width: '90%', fontSize: 24, color: Colors.greenDark }}
                      placeholder="Seu nome"
                      placeholderTextColor={Colors.transparentLight}
                      onChangeText={text =>
                        this.setState({
                          name: text
                        })
                      }
                      value={this.state.name}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
          <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
            {!opponent.name ? (
              <View>
                {waiting === null ? (
                  <View>
                    <AwesomeButton
                      onPress={this.startGame}
                      text="JOGAR"
                      disabled={!name && !this.state.name}
                      style={{ marginBottom: 20 }}
                    />
                  </View>
                ) : (
                  <View>
                    <ActivityIndicator color={Colors.white} size="large" />
                    <Text style={{ color: Colors.white, marginTop: 20 }}>
                      Procurando por adversário...
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View>
                <View style={{ alignItems: 'center', marginBottom: 25 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.greenLight }}>
                    Adversário encontrado:
                  </Text>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.white }}>
                    {opponent.name}
                  </Text>
                  <Text style={{ fontSize: 14, color: Colors.white }}>
                    {ranking(opponent.score)}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: Colors.greenLight, fontSize: 12, marginBottom: 10 }}>
                    O jogo começa em
                  </Text>
                  <RoundCounter count={countdown} />
                </View>
              </View>
            )}
            <View style={styles.ranking}>
              <Image resizeMode="contain" source={Media.icons.rank} style={styles.rankIcon} />
              <AwesomeButton
                onPress={() => this.props.navigation.push('Ranking')}
                text="Ranking"
                style={{ backgroundColor: 'transparent', minWidth: 100 }}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.background
  },
  content: {
    flex: 1
  },
  playerInfo: {
    flex: 1,
    backgroundColor: Colors.greenLight,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  ranking: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    bottom: 20,
    width: 120
  },
  rankIcon: {
    height: 15,
    width: 15
  }
}
