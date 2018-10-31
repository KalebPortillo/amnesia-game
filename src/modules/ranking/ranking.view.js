import React, { Component } from 'react'
import { View, TextInput, Text, ActivityIndicator, FlatList } from 'react-native'
import { Colors } from '../../theme'
import { AwesomeButton } from '../../components'
import Header from '../../components/header'
import getRanking from '../../utils/ranking'

type Props = {
  retrieveRanking: Function,
  user: Object,
  navigation: Object
}
export default class Home extends Component<Props> {
  componentDidMount() {
    this.props.retrieveRanking()
  }

  render() {
    const {
      user: { uid, ranking }
    } = this.props

    return (
      <View style={styles.container}>
        <Header title="Ranking" />
        <View style={styles.content}>
          {ranking.length > 0 ? (
            <FlatList
              data={ranking}
              keyExtractor={user => user.uid}
              renderItem={({ item }) => {
                const textColor = item.uid === uid ? Colors.greenDark : Colors.white
                return (
                  <View
                    style={{
                      height: 50,
                      width: '100%',
                      backgroundColor: Colors.greenLight,
                      marginBottom: 3,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20
                    }}
                  >
                    <Text style={{ color: textColor, fontSize: 15 }}>{item.name}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: textColor, fontSize: 12 }}>
                        {getRanking(item.score)}
                      </Text>
                      <Text style={{ color: textColor, fontSize: 12 }}>Pontos {item.score}</Text>
                    </View>
                  </View>
                )
              }}
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size={'large'} color={Colors.white} />
            </View>
          )}
        </View>
        <View style={{ flex: 1, padding: 10 }}>
          <AwesomeButton onPress={() => this.props.navigation.pop()} text={'voltar ao lobby'} />
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
    flex: 10
  },
  playerInfo: {
    flex: 1,
    backgroundColor: Colors.greenLight,
    justifyContent: 'center',
    paddingHorizontal: 20
  }
}
