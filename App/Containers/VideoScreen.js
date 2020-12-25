import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/VideoScreenStyle'
// import I18nJs from 'react-native-i18n'
import { Images, Colors } from '../Themes'
import PlayIcon from '../Components/PlayIcon'
import Avatar from '../Components/Avatar'
import CommentInput from '../Components/CommentInput'
import ImageLoad from 'react-native-image-placeholder'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { Actions } from 'react-native-router-flux'
import { url } from '../Lib/Utils'
import Video from 'react-native-video-player'
import moment from 'moment'
import I18nJs from 'react-native-i18n'
import { showError } from '../Lib/MessageBar'
import SafeAreaView from 'react-native-safe-area-view'
import Api from '../Services/Api'

const api = Api.create()

class VideoScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      commentText: '',
      comments: []
    }
  }

  componentWillMount () {
    this.getComments()
  }

  async getComments () {
    this.setState({ isGetData: true })
    const { token } = this.props.auth
    const { post } = this.props
    api.setToken(token)

    const query = {
      with: [
        'user',
        'comments.user'
      ],
      // sort: '-created_at',
      limit: 1000
    }

    const response = await api.getComments(post._id, query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('Get comments response', response)
    if (response.ok) {
      this.setState({ comments: response.data.data })
    } else {
      showError(response.data)
    }
  }

  onBack () {
    if (this.state.isPlaying) {
      this.setState({ isPlaying: false })
    } else {
      Actions.pop()
    }
  }

  renderHeader () {
    const { song } = this.props
    return (
      <View style={styles.header}>
        {this.state.isPlaying
          ? (
            <View style={styles.videoPreview}>
              <Video
                ref={ref => { this.videoPlayer = ref }}
                video={{ uri: url(song.file) }}
                placeholder={url(song.image)}
                style={styles.videoCover}
                autoplay
                onEnd={() => this.setState({ isPlaying: false })}
              />
            </View>
          )
          : (
            <View style={styles.videoPreview}>
              <ImageLoad
                style={styles.videoCover}
                loadingStyle={{ size: 'small', color: Colors.windowTint }}
                placeholderStyle={styles.videoCover}
                // placeholderSource={Images.logo}
                source={{ uri: url(song.image) }} />
              <View style={styles.videoContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.videoTitle}>{song.name}</Text>
                  <Text style={styles.instrumentTags}>{song.genres && song.genres.map(genre => `#${genre}`).join(', ')}</Text>
                </View>
                <PlayIcon white onPress={() => this.setState({ isPlaying: true })} />
              </View>
            </View>
          )}
        <TouchableOpacity style={styles.closeButton} onPress={() => this.onBack()}>
          <EvilIcons name='close-o' size={30} color={Colors.snow} />
        </TouchableOpacity>
      </View>
    )
  }

  renderItem ({ item }) {
    const comment = item
    return (
      <View>
        <View style={styles.row}>
          <Avatar size={30} source={comment.user.avatar} />
          <View style={styles.commentContent}>
            {this.props.comment
              ? (
                <Text style={styles.bandName}>
                  {comment.user.name} <Text style={styles.commentText}>{comment.text}</Text>
                </Text>
              )
              : (
                <Text style={styles.bandName}>
                  {comment.user.name}{' '}
                  <Text style={styles.commentText}>{comment.text}</Text>
                  {' '}
                  <Text
                    onPress={() => Actions.postCommentScreen({
                      comment,
                      onBack: () => {
                        Actions.pop()
                        this.getComments()
                      }
                    })}
                    style={styles.replyText}>
                    {I18nJs.t('reply')}
                  </Text>
                </Text>
              )
            }
            <Text style={styles.lastUpdateText}>{moment(comment.created_at).fromNow()}</Text>
          </View>
        </View>
        <View style={styles.hr} />
        {comment.comments && comment.comments.length && (
          <FlatList
            data={comment.comments}
            extraData={this.state}
            keyExtractor={item => item._id}
            renderItem={this.renderSubComment.bind(this)}
          // style={styles.scrollView}
          />
        )}
      </View>
    )
  }

  renderSubComment ({ item }) {
    const comment = item
    return (
      <View>
        <View style={styles.subRow}>
          <Avatar size={20} source={comment.user.avatar} />
          <View style={styles.commentContent}>
            <Text style={styles.bandName}>
              {comment.user.name} <Text style={styles.commentText}>{comment.text}</Text>
            </Text>
            <Text style={styles.lastUpdateText}>{moment(comment.created_at).fromNow()}</Text>
          </View>
        </View>
        <View style={styles.hr} />
      </View>
    )
  }

  sendButton () {
    return (
      <TouchableOpacity onPress={this.addComment.bind(this)}>
        <Image style={styles.sendButton} source={Images.sendButton} />
      </TouchableOpacity>
    )
  }

  async addComment () {
    Keyboard.dismiss()
    const { commentText } = this.state
    const { post } = this.props
    if (commentText) {
      const { token } = this.props.auth
      api.setToken(token)
      const response = await api.addComment(post._id, commentText)
      __DEV__ && console.log('Add comment response', response)
      if (response.ok) {
        this.setState({ commentText: '' })
        await this.getComments()
      } else {
        showError(response.data)
      }
    }
  }

  render () {
    const { post } = this.props
    const { comments } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {/* <StatusBar barStyle='light-content' /> */}

          {this.renderHeader()}
          <ScrollView
            ref='scrollView'
            style={styles.scrollView}>

            <View style={styles.authorView}>
              <Avatar size={35} source={post.user.avatar} />
              <View style={{ paddingHorizontal: 5 }}>
                <Text style={styles.bandName}>{post.user.name}</Text>
                <Text style={styles.lastUpdateText}>{moment(post.created_at).fromNow()}</Text>
              </View>
            </View>

            <Text style={styles.videoDescription} numberOfLines={4}>{post.text}</Text>

            <FlatList
              data={comments}
              extraData={this.state}
              keyExtractor={item => item._id}
              renderItem={this.renderItem.bind(this)}
            />

          </ScrollView>

          <CommentInput
            renderRight={this.sendButton.bind(this)}
            style={styles.newInput}
            value={this.state.commentText}
            onSubmitEditing={this.addComment.bind(this)}
            placeholder={I18nJs.t('writeComment')}
            returnKeyType='send'
            ref='commentInput'
            onChangeText={(commentText) => this.setState({ commentText })}
          />
          {Platform.OS === 'ios' && <KeyboardAvoidingView behavior='padding' />}
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoScreen)
