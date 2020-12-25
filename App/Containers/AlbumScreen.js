import React, { Component } from 'react'
import { ScrollView, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/AlbumScreenStyle'
import ImageLoad from 'react-native-image-placeholder'
import { Images, Colors } from '../Themes'
import { Actions } from 'react-native-gifted-chat'
import PlayIcon from '../Components/PlayIcon'

class AlbumScreen extends Component {
  renderSong ({ item, index }) {
    return (
      <View key={item._id}>
        <TouchableOpacity style={styles.row} onPress={Actions.playerScreen}>
          <Text style={styles.index}>{index + 1}</Text>
          <View style={styles.songContent}>
            <Text style={styles.songName}>Hello from heaven</Text>
          </View>
          <PlayIcon />
        </TouchableOpacity>
        <View style={styles.hr} />
      </View>
    )
  }

  renderMember ({ item }) {
    return (
      <TouchableOpacity style={styles.member}>
        <ImageLoad
          style={styles.avatar}
          loadingStyle={{ size: 'small', color: Colors.windowTint }}
          placeholderStyle={styles.avatar}
          // placeholderSource={Images.logo}
          borderRadius={35}
          source={{ uri: 'https://bandj.vn/wp-content/uploads/2016/11/choi-dj-can-nhung-gi5.jpg' }} />
        <Text style={styles.memberName}>{'Cui Jian'}</Text>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.album}>
          <View style={styles.albumCover}>
            <View style={styles.albumDisk} />
            <ImageLoad
              style={styles.albumImage}
              placeholderStyle={styles.albumImage}
              loadingStyle={{ size: 'small', color: Colors.windowTint }}
              // placeholderSource={Images.logo}
              source={{ uri: 'https://www.japantimes.co.jp/wp-content/uploads/2017/06/n-dj-a-20170531.jpg' }} />
          </View>
          <View style={styles.albumContent}>
            <Text style={styles.bandName}>Neon Trees</Text>
            <Text style={styles.albumName}>Rock Never Die</Text>
          </View>
        </View>
        <Text style={styles.description}>Before Neon Trees release, its carefree lead single, “Hello from Here,” was a revelation that there’d been a Miguel-sized hole in Rock…</Text>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8]}
          keyExtractor={(item, index) => index}
          renderItem={this.renderSong.bind(this)}
          style={styles.list}
        />
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          keyExtractor={(item, index) => index}
          renderItem={this.renderMember.bind(this)}
          style={styles.members}
          horizontal
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumScreen)
