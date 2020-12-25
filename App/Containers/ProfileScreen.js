import React, { Component } from 'react'
import { ScrollView, Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import AuthActions from '../Redux/AuthRedux'
import { bindActionCreators } from 'redux'
// Styles
import styles from './Styles/ProfileScreenStyle'
import I18nJs from 'react-native-i18n'
import { Images, Metrics, Colors } from '../Themes'
import { Actions } from 'react-native-router-flux'
import PostView from '../Components/PostView'
import Avatar from '../Components/Avatar'
import SquareImage from '../Components/SquareImage'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import { url } from '../Lib/Utils'
import _ from 'lodash'
import ActionSheet from 'react-native-actionsheet'
import Loading from 'react-native-loader-overlay'
import { ConfirmDialog } from 'react-native-simple-dialogs'

const api = Api.create()

class ProfileScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {},
      posts: [],
      myBands: [],
      alertVisible: false
    }
  }

  componentWillMount () {
    Actions.refresh({
      left: () => (
        <TouchableOpacity onPress={Actions.profileSearchScreen} style={styles.navButton}>
          <Image source={Images.iconMagnifier} style={styles.iconSmall} />
        </TouchableOpacity>
      )
    })
    this.getUser()
    this.getBands()
    this.getPosts()
  }

  async getUser () {
    this.setState({ isGetData: true })
    const { token } = this.props.auth
    const { user } = this.props
    api.setToken(token)

    const query = { with: ['instruments'] }

    const response = await api.getUser(user._id, query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get User response', response)
    if (response.ok) {
      this.setState({ user: response.data.data })
    } else {
      showError(response.data)
      Actions.pop()
    }
  }

  async getPosts (isRefreshing) {
    this.setState({ isGetData: true })
    const { token } = this.props.auth
    const { user } = this.props
    api.setToken(token)

    const query = {
      with: [
        'user',
        'images',
        'songs',
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
    const { token } = this.props.auth
    const { user } = this.props
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

  async getMyBands () {
    this.setState({ isGetData: true })
    const { token, user } = this.props.auth
    api.setToken(token)

    const response = await api.getUserBands(user._id, { with: ['users'] })
    this.setState({ isGetData: false })
    __DEV__ && console.log('get myBands response', response)
    if (response.ok) {
      this.setState({ myBands: response.data.data }, () => {
        this.ActionSheetInvite.show()
      })
    } else {
      showError(response.data)
    }
  }

  async onInvite (band) {
    const { user } = this.state
    const { token } = this.props.auth
    if (_.find(band.users, { _id: user._id })) {
      this.setState({ alertVisible: true, message: I18nJs.t('userJoined') })
      return false
    }

    api.setToken(token)
    this.loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    const response = await api.inviteUser(band._id, { user_id: user._id })
    __DEV__ && console.log('Send invite response', response)
    Loading.hide(this.loader)
    if (response.ok) {
      this.setState({ alertVisible: true, message: I18nJs.t('inviteSuccess') })
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

  async onFollowPress () {
    const { user } = this.state
    const { token } = this.props.auth
    api.setToken(token)
    const response = await api.followUser(user._id)
    __DEV__ && console.log('Follow response', response)
    if (response.ok) {
      this.props.setAuth({ user: response.data.data })
    } else {
      showError(response.data)
    }
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

  renderActions () {
    const { auth } = this.props
    const { user } = this.state
    const isFollowing = (auth.user.following_user_ids || []).includes(user._id)
    return (
      <View style={styles.actions}>
        <TouchableOpacity style={styles.action} onPress={() => Actions.chatScreen({ user })}>
          <Image style={styles.actionIcon} source={Images.iconMail} />
          <Text style={styles.actionText}>{I18nJs.t('message')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={() => this.onFollowPress()}>
          <Image style={styles.actionIcon} source={Images.iconPersonRed} />
          <Text style={styles.actionText}>{isFollowing ? I18nJs.t('following') : I18nJs.t('follow')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={() => this.getMyBands()}>
          <Image style={styles.actionIcon} source={Images.iconPlusRed} />
          <Text style={styles.actionText}>{I18nJs.t('invite')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderBands () {
    const bands = _.filter(this.state.bands, band => band.pivot.status !== 'pending')
    return bands.length ? (
      <FlatList
        horizontal
        style={styles.bands}
        data={this.state.bands}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.band} onPress={() => Actions.bandDetailScreen({ band: item })}>
            <SquareImage source={url(item.cover)} size={(Metrics.screenWidth - (4 * Metrics.baseMargin)) / 3} />
            <Text style={styles.bandName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.bandMembers}>{item.member_count || 1} {I18nJs.t('members')}</Text>
          </TouchableOpacity>
        )}
      />
    ) : null
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

        {this.renderActions()}

        {this.renderBands()}

        <FlatList
          data={this.state.posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <PostView item={item} showProfileOnPress={false} onLiked={this.onLiked.bind(this)} />}
          style={styles.songs}
        />

        <ActionSheet
          ref={ref => (this.ActionSheetInvite = ref)}
          title={I18nJs.t('selectYourBand')}
          options={[I18nJs.t('cancel'), ..._.map(this.state.myBands, 'name')]}
          cancelButtonIndex={0}
          onPress={(index) => {
            index && this.onInvite(this.state.myBands[index - 1])
          }}
        />

        <ConfirmDialog
          visible={this.state.alertVisible}
          title={this.state.message}
          onTouchOutside={() => this.setState({ alertVisible: false })}
          positiveButton={{
            title: I18nJs.t('ok'),
            onPress: () => this.setState({ alertVisible: false })
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
