import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, StatusBar, Image, FlatList, AppState, Platform, Alert } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PlayerScreenStyle'
import ImageLoad from 'react-native-image-placeholder'
import { Colors, Images } from '../Themes'
import { Actions } from 'react-native-router-flux'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
// import Slider from 'react-native-slider'
import I18nJs from 'react-native-i18n'
import PlayIcon from '../Components/PlayIcon'
import SquareImage from '../Components/SquareImage'
import TrackPlayer from 'react-native-track-player'
import PlayerBar from '../Components/PlayerBar'
import { url } from '../Lib/Utils'
import _ from 'lodash'
import moment from 'moment'
import { Bars } from 'react-native-loader'
import SafeAreaView from 'react-native-safe-area-view'

class PlayerScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      playerState: 'STATE_STOPPED',
      song: props.song,
      tracks: props.post ? props.post.songs.map(song => {
        return {
          id: song._id,
          url: url(song.file),
          title: song.name,
          artist: song.artist || I18nJs.t('noArtist'),
          artwork: url(song.image)
        }
      }) : []
    }
  }

  async componentDidMount () {
    AppState.addEventListener('change', this._handleStateChange.bind(this))
    await TrackPlayer.setupPlayer()
    // Adds a track to the queue
    await TrackPlayer.add(this.state.tracks)

    TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SEEK_TO,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
      ]
    })

    TrackPlayer.registerEventHandler(this.eventHandler.bind(this))

    // Starts playing it
    await TrackPlayer.play()

    // this.setState({ playerState: 'STATE_PLAYING' })
  }

  _handleStateChange (appState) {
    if (appState === 'active') {
      // Updates the playback information when the app is back from background mode
      this.updatePlayback()
    }
  }

  componentWillUnmount () {
    TrackPlayer.stop()
    AppState.removeEventListener('change', this._handleStateChange.bind(this))
  }

  updatePlayback () {

  }

  async eventHandler (data) {
    switch (data.type) {
      // Forward remote events to the player
      case 'remote-play':
        TrackPlayer.play()
        // this.setState({ playerState: 'STATE_PLAYING' })
        break
      case 'remote-pause':
        TrackPlayer.pause()
        // this.setState({ playerState: 'STATE_PAUSED' })
        break
      case 'remote-stop':
        TrackPlayer.stop()
        // this.setState({ playerState: 'STATE_STOPPED' })
        break
      case 'remote-next':
        TrackPlayer.skipToNext()
        break
      case 'remote-previous':
        TrackPlayer.skipToPrevious()
        break
      case 'remote-seek':
        TrackPlayer.seekTo(data.position)
        break

      // You can make ducking smoother by adding a fade in/out
      case 'remote-duck':
        // TrackPlayer.setVolume(data.ducking ? 0.5 : 1)
        break
      // Playback updates
      case 'playback-state':
        this.setState({ playerState: data.state })
        // store.dispatch(playbackState(data.state));
        break
      case 'playback-track-changed':
        if (!this.props.post) {
          return false
        }
        const song = _.find(this.props.post.songs, { _id: data.nextTrack })
        song && this.setState({ song })
        break
      case 'playback-error':
        Alert.alert('An error ocurred', data.error)
        break
    }
  }

  async previousTrack () {
    try {
      await TrackPlayer.skipToPrevious()
    } catch (_) {
      // this.setState({ playerState: 'STATE_STOPPED' })
    }
  }

  async nextTrack () {
    try {
      await TrackPlayer.skipToNext()
    } catch (_) {
      TrackPlayer.reset()
      // this.setState({ playerState: 'STATE_STOPPED' })
    }
  }

  async pauseTrack () {
    const state = await TrackPlayer.getState()
    try {
      if (state === 'STATE_STOPPED') {
        await TrackPlayer.add(this.state.tracks)
        await TrackPlayer.play()
      } else if (state === 'STATE_PAUSED') {
        await TrackPlayer.play()
        this.setState({ playerState: 'STATE_PLAYING' })
      } else if (state === 'STATE_PLAYING') {
        await TrackPlayer.pause()
        // this.setState({ playerState: 'STATE_PAUSED' })
      }
    } catch (_) {
      await TrackPlayer.reset()
      await TrackPlayer.add(this.state.tracks)
      await TrackPlayer.play()
    }
  }

  renderSong ({ item }) {
    return (
      <View style={styles.row}>
        <SquareImage source={item.album ? item.album.cover : item.image} size={40} />
        <View style={styles.songInfo}>
          <Text style={styles.songName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.songTime}>{item.album ? item.album.name : I18nJs.t('noAlbum')}</Text>
        </View>
        {this.state.song._id === item._id
          ? <Bars size={5} color={Colors.primary} />
          : <PlayIcon onPress={() => TrackPlayer.skip(item._id)} />
        }
      </View>
    )
  }

  render () {
    const { song } = this.state
    return (
      <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
        <View style={styles.container}>
          {/* <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} /> */}
          <View style={styles.header}>
            <ImageLoad
              style={styles.avatar}
              placeholderStyle={styles.avatar}
              loadingStyle={{ size: 'small', color: Colors.windowTint }}
              borderRadius={3}
              // placeholderSource={Images.logo}
              source={{ uri: url(song.image) }} />
            <View style={styles.overlay} />
            <View style={styles.genres}>
              <Text style={styles.instrumentTags}>{song.genres && song.genres.map(genre => `#${genre}`).join(' ')}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={Actions.pop}>
              <EvilIcons name='close-o' size={30} color={Colors.snow} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.titleBlock}>
              <Image source={Images.iconStar} style={styles.iconSmall} />
              <Text style={styles.author}>{song.album ? song.album.name : I18nJs.t('noAlbum')}</Text>
              <Image source={Images.iconDotsCircle} style={styles.iconSmall} />
            </View>
            <Text style={styles.mainSongName}>{this.state.song.name}</Text>

            <View style={styles.mediaControls}>
              <PlayerBar />
              <View style={styles.controls}>
                <TouchableOpacity onPress={this.previousTrack.bind(this)}>
                  <Entypo name='controller-fast-backward' size={40} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pauseTrack.bind(this)}>
                  {this.state.playerState === 'STATE_PLAYING' && <Entypo name='controller-paus' size={40} />}
                  {this.state.playerState !== 'STATE_PLAYING' && <Entypo name='controller-play' size={40} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={this.nextTrack.bind(this)}>
                  <Entypo name='controller-fast-forward' size={40} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.listTitle}>{I18nJs.t('upNext')}</Text>
            <FlatList
              data={this.props.post ? this.props.post.songs : []}
              renderItem={this.renderSong.bind(this)}
              keyExtractor={(item, index) => item._id}
              extraData={this.state}
            />
          </ScrollView>
        </View >
      </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerScreen)
