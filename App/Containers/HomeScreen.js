import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, RefreshControl, FlatList, Platform, StatusBar } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import { bindActionCreators } from 'redux'
import SocketActions from '../Redux/SocketRedux'

// Styles
import styles from './Styles/HomeScreenStyle'
import I18nJs from 'react-native-i18n'
import { Images, Colors } from '../Themes'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import { showError } from '../Lib/MessageBar'
import Loading from 'react-native-loader-overlay'
import Api from '../Services/Api'
import SafeAreaView from 'react-native-safe-area-view'
import PostView from '../Components/PostView'

const api = Api.create()

class HomeScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      posts: [],
      isRefreshing: false
    }

    this.onEndReachedCalledDuringMomentum = true
  }

  async componentWillMount () {
    this.loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    await this.getPosts()
    Loading.hide(this.loader)
    this.props.openSocket()
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

    const response = await api.getPosts(query)
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

  async onRefreshData () {
    this.setState({ isRefreshing: true, lastPost: undefined })
    await this.getPosts(true)
    this.setState({ isRefreshing: false })
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

  onEndReached ({ distanceFromEnd }) {
    if (!this.onEndReachedCalledDuringMomentum) {
      this.getPosts()
      this.onEndReachedCalledDuringMomentum = true
    }
  }

  renderHeader () {
    return (
      <View style={styles.header}>
        {/* <Text style={styles.lastUpdateText}>{'Updated 1 hour ago'}</Text> */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{I18nJs.t('myFeed')}</Text>
          <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => Actions.profileSearchScreen()}>
            <Image source={Images.iconMagnifier} style={styles.iconSmall} />
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => Actions.newPostScreen({ refreshData: () => this.onRefreshData() })}>
            <Image source={Images.iconPlus} style={styles.iconSmall} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render () {
    const { posts } = this.state
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle='dark-content' />}
          {this.renderHeader()}
          <FlatList
            data={posts}
            extraData={this.state}
            keyExtractor={item => item._id}
            renderItem={({ item }) => <PostView item={item} onLiked={this.onLiked.bind(this)} />}
            style={styles.main}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefreshData.bind(this)}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            onEndReachedThreshold={0.5}
            onEndReached={this.onEndReached.bind(this)}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
          />
        </View>
      </SafeAreaView>
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
    ...bindActionCreators(SocketActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
