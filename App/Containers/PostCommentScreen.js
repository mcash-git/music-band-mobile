import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PostCommentScreenStyle'
// import I18nJs from 'react-native-i18n'
import { Images } from '../Themes'
// import PlayIcon from '../Components/PlayIcon'
import Avatar from '../Components/Avatar'
import CommentInput from '../Components/CommentInput'
// import ImageLoad from 'react-native-image-placeholder'
// import EvilIcons from 'react-native-vector-icons/EvilIcons'
// import { Actions } from 'react-native-router-flux'
// import { url } from '../Lib/Utils'
// import Video from 'react-native-af-video-player'
import moment from 'moment'
import I18nJs from 'react-native-i18n'
import { showError } from '../Lib/MessageBar'
// import Loading from 'react-native-loader-overlay'
import Api from '../Services/Api'
import { Actions } from 'react-native-router-flux'

const api = Api.create()

class PostCommentScreen extends Component {
  state = {
    commentText: '',
    comments: []
  }

  componentWillMount () {
    this.getComments()
  }

  async getComments () {
    this.setState({ isGetData: true })
    const { token } = this.props.auth
    const { post, comment } = this.props
    api.setToken(token)

    const query = {
      with: [
        'user',
        'comments.user'
      ],
      // sort: '-created_at',
      limit: 1000
    }

    let response = null
    if (comment) {
      response = await api.getSubComments(comment._id, query)
    } else {
      response = await api.getComments(post._id, query)
    }
    this.setState({ isGetData: false })
    __DEV__ && console.log('Get comments response', response)
    if (response.ok) {
      this.setState({ comments: response.data.data })
    } else {
      showError(response.data)
    }
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
    const { post, comment } = this.props
    if (commentText) {
      const { token } = this.props.auth
      api.setToken(token)
      let response = null
      if (comment) {
        response = await api.addSubComment(comment._id, commentText)
      } else {
        response = await api.addComment(post._id, commentText)
      }
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
    let { comments } = this.state
    let { comment } = this.props
    if (comment) {
      comment.comments = comments
      comments = [comment]
    }
    return (
      <View style={styles.container}>

        <FlatList
          data={comments}
          extraData={this.state}
          keyExtractor={item => item._id}
          renderItem={this.renderItem.bind(this)}
          style={styles.scrollView}
        />

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
        {Platform.OS === 'ios' && <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={65} />}
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostCommentScreen)
