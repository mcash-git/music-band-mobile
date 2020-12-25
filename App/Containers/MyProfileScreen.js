import React, { Component } from 'react'
import { ScrollView, Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import AuthActions from '../Redux/AuthRedux'

// Styles
import styles from './Styles/MyProfileScreenStyle'
import I18nJs from 'react-native-i18n'
import { Images, Colors, Metrics } from '../Themes'
import Avatar from '../Components/Avatar'
import SquareImage from '../Components/SquareImage'
import { Actions } from 'react-native-router-flux'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { bindActionCreators } from 'redux'
import { showError } from '../Lib/MessageBar'
import Loading from 'react-native-loader-overlay'
import Api from '../Services/Api'
import { url } from '../Lib/Utils'
import _ from 'lodash'
import PostView from '../Components/PostView'
import { ConfirmDialog } from 'react-native-simple-dialogs'

const api = Api.create()

class MyProfileScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {},
      posts: [],
      bands: [],
      dialogVisible: false
    }
  }

  componentWillMount () {
    Actions.refresh({
      left: () => (
        <TouchableOpacity onPress={Actions.profileSearchScreen} style={styles.navButton}>
          <Image source={Images.iconMagnifier} style={styles.iconSmall} />
        </TouchableOpacity>
      ),
      right: () => (
        <TouchableOpacity onPress={Actions.settingScreen} style={styles.navButton}>
          <EvilIcons name='gear' size={25} />
        </TouchableOpacity>
      )
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.enterTime !== this.state.enterTime) {
      this.setState({ enterTime: nextProps.enterTime })
      this.getUser()
      this.getBands()
      this.getPosts()
    }
  }

  async getUser () {
    const loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    const { user, token } = this.props.auth
    api.setToken(token)
    const response = await api.getUser(user._id, { with: ['instruments', 'bands', 'posts'] })
    __DEV__ && console.log('Update user response', response)
    Loading.hide(loader)
    if (response.ok) {
      this.setState({ user: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async getPosts (isRefreshing) {
    this.setState({ isGetData: true })
    const { user, token } = this.props.auth
    api.setToken(token)

    const query = {
      with: [
        'user',
        'images',
        'songs.album',
        {
          'likes': {
            where: {
              user_id: user._id
            }
          }
        }
      ],
      sort: '-created_at',
      limit: 10
    }
    if (this.state.lastPost && !isRefreshing) {
      query.where = {
        created_at: {
          $lt: this.state.lastPost.created_at
        }
      }
    }

    const response = await api.getUserPosts(user._id, query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('getFeed response', response)
    if (response.ok) {
      const posts = response.data.data.map(post => {
        post.is_liked = post.likes && post.likes.length > 0
        return post
      })
      if (posts.length) {
        const lastPost = _.minBy(posts, 'created_at')
        if (isRefreshing) {
          this.setState({ posts, lastPost })
        } else {
          this.setState({ posts: _.unionBy(this.state.posts, posts, '_id'), lastPost })
        }
      }
    } else {
      showError(response.data)
    }
  }

  async getBands () {
    this.setState({ isGetData: true })
    const { user, token } = this.props.auth
    api.setToken(token)

    const query = { with: ['users'] }

    const response = await api.getUserBands(user._id, query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('getBands response', response)
    if (response.ok) {
      this.setState({ bands: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async joinBand () {
    this.setState({ isGetData: true, dialogVisible: false })
    const { token } = this.props.auth
    const { band } = this.state
    api.setToken(token)

    const response = await api.joinBand(band._id)
    this.setState({ isGetData: false })
    __DEV__ && console.log('join band response', response)
    if (response.ok) {
      this.getBands()
    } else {
      showError(response.data)
    }
  }

  onLiked (item, like) {
    const posts = this.state.posts.map(post => {
      if (post._id === item._id) {
        post.is_liked = like
      }
      return post
    })
    this.setState({ posts })
  }

  renderStatitics () {
    const { user } = this.state
    return (
      <View style={styles.statitics}>
        <View style={styles.statitic}>
          <Text style={styles.statiticValue}>{user.band_count || 0}</Text>
          <Text style={styles.statiticLabel}>{I18nJs.t('bands')}</Text>
        </View>
        <View style={styles.statitic}>
          <Text style={styles.statiticValue}>{user.song_count || 0}</Text>
          <Text style={styles.statiticLabel}>{I18nJs.t('songs')}</Text>
        </View>
        <View style={styles.statitic}>
          <Text style={styles.statiticValue}>{user.follower_count || 0}</Text>
          <Text style={styles.statiticLabel}>{I18nJs.t('followers')}</Text>
        </View>
        <View style={styles.statitic}>
          <Text style={styles.statiticValue}>{user.following_count || 0}</Text>
          <Text style={styles.statiticLabel}>{I18nJs.t('following')}</Text>
        </View>
      </View>
    )
  }

  renderInstruments () {
    const { user } = this.state
    return (
      <View style={styles.instruments}>
        {user.instruments && user.instruments.map((instrument, index) => (
          <View style={styles.instrument} key={index.toString()}>
            <Image source={{ uri: url(instrument.image) }} style={styles.iconTiny} />
          </View>
        ))}
      </View>
    )
  }

  renderBands () {
    const { bands } = this.state
    return (
      <FlatList
        horizontal
        style={styles.bands}
        data={bands}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.band} onPress={() => Actions.bandDetailScreen({ band: item })}>
            <SquareImage source={url(item.cover)} size={(Metrics.screenWidth - (4 * Metrics.baseMargin)) / 3} />
            <Text style={styles.bandName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.bandMembers}>{item.member_count || 1} {I18nJs.t('members')}</Text>
            {item.pivot.status === 'pending' && (
              <TouchableOpacity style={styles.overlay} onPress={() => this.setState({ band: item, dialogVisible: true })}>
                <Text style={styles.pending}>{I18nJs.t('youAreInvited')}</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        ListFooterComponent={(
          <TouchableOpacity style={styles.band} onPress={Actions.bandCreateScreen}>
            <View style={styles.addMember}>
              <Image source={Images.iconPlusRed} style={styles.plusIcon} />
            </View>
            <Text style={styles.createBandText}>{I18nJs.t('createABand')}</Text>
          </TouchableOpacity>
        )}
      />
    )
  }

  render () {
    const { user } = this.state
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Avatar source={user.avatar} size={50} />
          <View style={styles.headerRight}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.address}>{user.district}, {user.province}</Text>
            {this.renderInstruments()}
          </View>
        </View>

        {this.renderStatitics()}

        <Text style={styles.title}>{I18nJs.t('myBands')}</Text>
        {this.renderBands()}

        <Text style={styles.title}>{I18nJs.t('myPosts')}</Text>
        <FlatList
          data={this.state.posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <PostView item={item} showProfileOnPress={false} onLiked={this.onLiked.bind(this)} />}
          style={styles.songs}
          ListEmptyComponent={<Text style={styles.empty}>{I18nJs.t('noPostAvailable')}</Text>}
        />
        <ConfirmDialog
          title={I18nJs.t('musicBands')}
          message={I18nJs.t('youAreInvited')}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({ dialogVisible: false })}
          positiveButton={{
            title: I18nJs.t('accept'),
            onPress: () => this.joinBand()
          }}
          negativeButton={{
            title: I18nJs.t('showBand'),
            onPress: () => this.setState({ dialogVisible: false }, () => Actions.bandDetailScreen({ band: this.state.band }))
          }}
        />
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileScreen)
