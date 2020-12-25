import React, { Component } from 'react'
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ProfileSearchScreenStyle'
import Searchbar from '../Components/Searchbar'
import I18nJs from 'react-native-i18n'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { Colors, Images } from '../Themes'
import { Actions } from 'react-native-router-flux'
import PlayIcon from '../Components/PlayIcon'
import SquareImage from '../Components/SquareImage'
import Avatar from '../Components/Avatar'
import ImageLoad from 'react-native-image-placeholder'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import { url } from '../Lib/Utils'
import moment from 'moment'

const api = Api.create()

class ProfileSearchScreen extends Component {
  constructor (props) {
    super(props)
    let instrumentUrls = {}
    for (const instrument of props.instruments) {
      instrumentUrls[instrument._id] = url(instrument.image)
    }
    this.state = {
      users: [],
      bands: [],
      songs: [],
      instrumentUrls,
      search: ''
    }
  }

  async onSearch () {
    await [
      this.searchArtists(),
      this.getBands(),
      this.getSongs()
    ]
  }

  async searchArtists () {
    const { token } = this.props.auth
    const { search } = this.state
    api.setToken(token)

    const query = {}

    const response = await api.searchUsers(query, search)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get users response', response)
    if (response.ok) {
      this.setState({ users: response.data.data })
    } else {
      showError(response.data)
    }
  }
  async getBands () {
    const { token } = this.props.auth
    const { search } = this.state
    api.setToken(token)

    const query = {}

    const response = await api.getBands(query, search)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get bands response', response)
    if (response.ok) {
      this.setState({ bands: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async getSongs () {
    const { token } = this.props.auth
    const { search } = this.state
    api.setToken(token)

    const query = {
      with: ['album', 'post.user']
    }

    const response = await api.getSongs(query, search)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get songs response', response)
    if (response.ok) {
      this.setState({ songs: response.data.data })
    } else {
      showError(response.data)
    }
  }

  renderArtist ({ item }) {
    return (
      <TouchableOpacity style={styles.row} onPress={() => Actions.profileScreen({ user: item })}>
        <Avatar source={item.avatar} size={40} />
        <View style={styles.rowMiddle}>
          <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.artistAddress}>{item.district}, {item.province}</Text>
          <View style={styles.interests}>
            {item.instrument_ids.map((instrumentId, index) => (
              <View style={styles.interest} key={index.toString()}>
                <Image source={{ uri: this.state.instrumentUrls[instrumentId] }} style={styles.iconTiny} />
              </View>
            ))}
          </View>
        </View>
        <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
      </TouchableOpacity>
    )
  }

  renderBand ({ item }) {
    return (
      <TouchableOpacity style={styles.band} onPress={() => Actions.bandDetailScreen({ band: item })}>
        <ImageLoad
          style={styles.cover}
          // placeholderSource={Images.logo}
          placeholderStyle={styles.cover}
          source={{ uri: url(item.cover) }}
        />
        <View style={styles.overlay} />
        <View style={styles.bandContent}>
          <Text style={styles.bandName} numberOfLines={1}>{item.name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Image source={Images.iconStar} style={styles.iconTiny} />
            <Text style={styles.ratingText}>{'4.97'}</Text>
          </View>
          <View style={styles.rowTags}>
            <View style={styles.tags}>
              {item.genres.map((genre, index) => (
                <View style={styles.tag} key={index.toString()}><Text style={styles.tagName}>#{genre}</Text></View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderSong ({ item }) {
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => null
          // item.type === 'video'
          //   ? Actions.videoScreen({ song: item, post: item.post })
          //   : Actions.playerScreen({ song: item, post: item.post })
        }>
        <SquareImage source={item.album ? item.album.cover : item.image} size={40} />
        <View style={styles.songInfo}>
          <Text style={styles.songName} numberOfLines={1}>{item.name}>{item.name}</Text>
          <Text style={styles.songTime}>{moment.utc(item.created_at).fromNow()}</Text>
        </View>
        <View style={styles.playButton}>
          {item.type === 'video'
            ? <PlayIcon />
            : <Image source={Images.musicButton} style={styles.playIcon} />
          }
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    const { users, bands, songs } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.searchBlock}>
          <Searchbar
            placeholder={I18nJs.t('search')}
            value={this.state.search}
            onChangeText={text => this.setState({ search: text })}
            onSubmitEditing={() => this.onSearch()}
          />
        </View>
        <ScrollableTabView
          tabBarBackgroundColor={Colors.snow}
          tabBarActiveTextColor={Colors.primary}
          tabBarUnderlineStyle={styles.tabbarUnderLine}
          tabBarTextStyle={styles.tabbarText}
        >
          <View tabLabel={I18nJs.t('artists')}>
            <Text style={styles.resultNumber}>{I18nJs.t('resultFound', { number: users.length })}</Text>
            <FlatList
              data={users}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderArtist.bind(this)}
              extraData={this.state}
            />
          </View>
          <View tabLabel={I18nJs.t('bands')}>
            <Text style={styles.resultNumber}>{I18nJs.t('resultFound', { number: bands.length })}</Text>
            <FlatList
              data={bands}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderBand.bind(this)}
              extraData={this.state}
            />
          </View>
          <View tabLabel={I18nJs.t('songs')}>
            <Text style={styles.resultNumber}>{I18nJs.t('resultFound', { number: songs.length })}</Text>
            <FlatList
              data={songs}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderSong.bind(this)}
              extraData={this.state}
            />
          </View>
        </ScrollableTabView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    instruments: state.instrument.instruments
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSearchScreen)
