import React, { Component } from 'react'
import { ScrollView, Text, View, Image, TouchableOpacity, FlatList, StatusBar } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import AuthActions from '../Redux/AuthRedux'
import { bindActionCreators } from 'redux'
// Styles
import styles from './Styles/BandDetailScreenStyle'
import { Images, Colors } from '../Themes'
import I18nJs from 'react-native-i18n'
import ImageLoad from 'react-native-image-placeholder'
import Avatar from '../Components/Avatar'
import PlayIcon from '../Components/PlayIcon'
import SquareImage from '../Components/SquareImage'
import { url } from '../Lib/Utils'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import { ConfirmDialog } from 'react-native-simple-dialogs'
import Loading from 'react-native-loader-overlay'

const api = Api.create()

class BandDetailScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      members: [],
      songs: [],
      dialogVisible: false,
      alertVisible: false,
      user: null
    }
  }

  componentWillMount () {
    this.getMembers()
    this.getSongs()
  }

  async getMembers () {
    const { token } = this.props.auth
    const { band } = this.props

    api.setToken(token)

    const query = { limit: 100 }

    const response = await api.getBandMembers(band._id, query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get members response', response)
    if (response.ok) {
      this.setState({ members: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async getSongs () {
    const { token } = this.props.auth
    const { band } = this.props

    api.setToken(token)

    const query = {}

    const response = await api.getBandSongs(band._id, query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get songs response', response)
    if (response.ok) {
      this.setState({ songs: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async sendInvite () {
    const { user } = this.state
    const { token } = this.props.auth
    const { band } = this.props

    api.setToken(token)
    this.loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    this.setState({ isInviting: true, dialogVisible: false })
    const response = await api.inviteUser(band._id, { user_id: user._id })
    this.setState({ isInviting: false })
    __DEV__ && console.log('Send invite response', response)
    Loading.hide(this.loader)
    if (response.ok) {
      this.getMembers()
    } else {
      showError(response.data)
    }
  }

  onPickUser (user) {
    if (!_.find(this.state.members, { _id: user._id })) {
      this.setState({ user, dialogVisible: true })
    } else {
      this.setState({ alertVisible: true })
    }
  }

  async onFollowPress () {
    const { band } = this.props
    const { token } = this.props.auth
    api.setToken(token)
    const response = await api.followBand(band._id)
    __DEV__ && console.log('Follow response', response)
    if (response.ok) {
      this.props.setAuth({ user: response.data.data })
    } else {
      showError(response.data)
    }
  }

  renderHeader () {
    const { band, auth } = this.props
    const isFollowing = (auth.user.following_band_ids || []).includes(band._id)
    return (
      <View style={styles.header}>
        <ImageLoad
          style={styles.cover}
          // placeholderSource={Images.logo}
          placeholderStyle={styles.cover}
          source={{ uri: url(band.cover) }}
        />
        <View style={styles.overlay} />
        <View style={styles.bandContent}>
          <Text style={styles.bandName}>{band.name}</Text>
          {/* <View style={{ flexDirection: 'row' }}>
            <Image source={Images.iconStar} style={styles.iconTiny} />
            <Text style={styles.ratingText}>{'4.97'}</Text>
          </View> */}
          <View style={styles.rowTags}>
            <ScrollView horizontal style={styles.tags}>
              {band.genres.map((genre, index) => (
                <View style={styles.tag} key={index.toString()}>
                  <Text style={styles.tagName}>#{genre}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.followButton} onPress={() => this.onFollowPress()}>
              <Text style={styles.followText}>{isFollowing ? I18nJs.t('following') : I18nJs.t('follow')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  renderMember ({ item }) {
    const pending = item.pivot.status === 'pending'
    return (
      <TouchableOpacity style={styles.member}>
        <Avatar source={item.avatar} size={70} />
        <Text style={[styles.memberName, pending ? { color: Colors.grey } : null]}>{item.name}</Text>
        {pending && (
          <View style={styles.avatarOverlay}>
            <Text style={styles.pending}>{I18nJs.t('pending')}</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  renderSong ({ item, index }) {
    return (
      <View style={styles.song}>
        <SquareImage source={item.image || (item.album ? item.album.cover : null)} size={40} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.songName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.songTime}>{item.album ? item.album.name : I18nJs.t('noAlbum')}</Text>
        </View>
        <PlayIcon />
      </View>
    )
  }

  render () {
    const { band } = this.props
    const isAdmin = !!_.find(band.users, user => user.pivot.is_admin && user._id === this.props.auth.user._id)
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        {this.renderHeader()}
        <ScrollView>
          <View style={styles.statitic}>
            <View style={styles.statiticItem}>
              <Text style={styles.number}>{band.member_count || 0}</Text>
              <Text style={styles.numberLabel}>{I18nJs.t('musicians')}</Text>
            </View>
            <View style={styles.statiticItem}>
              <Text style={styles.number}>{band.song_count || 0}</Text>
              <Text style={styles.numberLabel}>{I18nJs.t('songs')}</Text>
            </View>
            <View style={styles.statiticItem}>
              <Text style={styles.number}>{band.clip_count || 0}</Text>
              <Text style={styles.numberLabel}>{I18nJs.t('clips')}</Text>
            </View>
            <View style={styles.statiticItem}>
              <Text style={styles.number}>{band.follower_count || 0}</Text>
              <Text style={styles.numberLabel}>{I18nJs.t('followers')}</Text>
            </View>
          </View>
          <FlatList
            data={this.state.members}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderMember.bind(this)}
            style={styles.members}
            horizontal
            extraData={this.state}
            ListHeaderComponent={isAdmin
              ? (
                <View style={styles.member}>
                  <TouchableOpacity style={styles.addMember}
                    onPress={() => Actions.searchUserScreen({
                      onPickUser: (user) => this.onPickUser(user)
                    })}
                  >
                    <Image source={Images.iconPlusRed} style={styles.plusIcon} />
                  </TouchableOpacity>
                  <Text style={styles.addMemberText}>{I18nJs.t('addNew')}</Text>
                </View>
              ) : null}
          />
          <FlatList
            data={this.state.songs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderSong.bind(this)}
            style={styles.songs}
            extraData={this.state}
            ListEmptyComponent={<Text style={styles.empty}>{I18nJs.t('noSongAvailable')}</Text>}
          />
        </ScrollView>
        <ConfirmDialog
          title={I18nJs.t('musicBands')}
          message={I18nJs.t('inviteMessage', { name: this.state.user ? this.state.user.name : '', band: this.props.band.name })}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({ dialogVisible: false })}
          positiveButton={{
            title: I18nJs.t('invite'),
            onPress: () => this.sendInvite()
          }}
          negativeButton={{
            title: I18nJs.t('cancel'),
            onPress: () => this.setState({ dialogVisible: false })
          }}
        />
        <ConfirmDialog
          visible={this.state.alertVisible}
          title={I18nJs.t('userJoined')}
          onTouchOutside={() => this.setState({ alertVisible: false })}
          positiveButton={{
            title: I18nJs.t('ok'),
            onPress: () => this.setState({ alertVisible: false })
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAuth: bindActionCreators(AuthActions.setAuth, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandDetailScreen)
