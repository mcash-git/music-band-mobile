import React, { Component } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import { bindActionCreators } from 'redux'
import SocketActions from '../Redux/SocketRedux'

// Styles
import styles from './Styles/ChatScreenStyle'
import { Bubble, Composer } from 'react-native-gifted-chat'
import { Colors, Images, Fonts } from '../Themes'
import { Actions } from 'react-native-router-flux'
import { GiftedChat } from '../Components/GiftedChat/GiftedChat'
import CustomActions from '../Components/GiftedChat/CustomActions'
import InputToolbar from '../Components/GiftedChat/InputToolbar'
import Send from '../Components/GiftedChat/Send'
import Avatar from '../Components/Avatar'
import SquareImage from '../Components/SquareImage'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import moment from 'moment'
import _ from 'lodash'
import { url } from '../Lib/Utils'
import RNFetchBlob from 'react-native-fetch-blob'
import Config from 'react-native-config'

const api = Api.create()

class ChatScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      messages: [],
      user: props.user,
      band: props.band,
      conversation: props.conversation,
      lastMessage: moment().toDate(),
      isGetData: true,
      loadEarlier: false
    }
  }

  async componentWillMount () {
    const { user, band } = this.props
    if (user) {
      Actions.refresh({
        title: user.name,
        right: () => <TouchableOpacity style={{ paddingHorizontal: 10 }}><Avatar source={user.avatar} size={30} /></TouchableOpacity>
      })
    } else if (band) {
      Actions.refresh({
        title: band.name,
        right: () => <TouchableOpacity style={{ paddingHorizontal: 10 }}><SquareImage source={band.cover} size={30} /></TouchableOpacity>
      })
    }

    this.props.openSocket()
    if (!this.state.conversation) {
      await this.getConversation()
    } else {
      await this.getMessages(true)
      this.readConversation()
    }
  }

  async getConversation () {
    const { token } = this.props.auth
    const { user, band } = this.props
    let type = ''
    let target = null
    if (user) {
      type = 'private'
      target = user._id
    } else if (band) {
      type = 'room'
      target = band._id
    }
    api.setToken(token)
    const response = await api.getConversation(type, target)
    __DEV__ && console.log('Get conversation response', response)
    if (response.ok) {
      this.setState({ isGetData: false, conversation: response.data.data }, () => this.getMessages())
    } else {
      showError(response.data)
    }
  }

  async readConversation () {
    const { token } = this.props.auth
    const { conversation } = this.state
    api.setToken(token)
    const response = await api.readConversation(conversation._id)
    __DEV__ && console.log('Read conversation response', response)
    if (!response.ok) {
      showError(response.data)
    }
  }

  async getMessages () {
    if (!this.state.conversation) return false
    this.setState({ isGetData: true })
    const query = {
      with: ['user'],
      sort: '-created_at',
      limit: 20
    }
    if (this.state.lastMessage) {
      query.where = {
        created_at: {
          $lt: this.state.lastMessage
        }
      }
    }
    const { token } = this.props.auth
    api.setToken(token)
    const response = await api.getMessages(this.state.conversation._id, query)
    __DEV__ && console.log('Get messages response', response)
    if (response.ok) {
      const messages = _.unionBy(this.state.messages, response.data.data, '_id')
      let lastMessage = _.min(_.map(messages, 'created_at'))
      lastMessage = lastMessage ? moment(lastMessage).toDate() : this.state.lastMessage
      const loadEarlier = !!response.data.data.length
      this.setState({ isGetData: false, messages, lastMessage, loadEarlier })
    } else {
      showError(response.data)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (
      !!nextProps.recieveMessage &&
      !!this.state.conversation &&
      nextProps.recieveMessage !== this.props.recieveMessage &&
      nextProps.recieveMessage.asMutable(true).conversation_id === this.state.conversation._id
    ) {
      const newMessage = nextProps.recieveMessage.asMutable()
      newMessage.createdAt = newMessage.created_at
      const messages = _.unionBy([newMessage], this.state.messages, '_id')
      const lastMessage = moment.utc(_.min(_.map(messages, 'created_at'))).toDate()
      this.setState({
        messages,
        lastMessage
      })
      this.readConversation()
    }
    this.forceUpdate()
  }

  async openConversation () {
    const { token } = this.props.auth
    const { user, band } = this.props
    let type = ''
    let target = null
    if (user) {
      type = 'private'
      target = user._id
    } else if (band) {
      type = 'room'
      target = band._id
    } else {
      return false
    }
    api.setToken(token)
    const response = await api.openConversation(type, target)
    __DEV__ && console.log('Open conversation response', response)
    if (response.ok) {
      this.setState({ isGetData: false, conversation: response.data.data })
      return response.data.data
    } else {
      showError(response.data)
    }
  }

  async onSend (messages = []) {
    if (messages.length) {
      let { conversation } = this.state
      if (!conversation) {
        conversation = await this.openConversation()
      }
      if (!conversation) {
        return false
      }
      const message = messages[0]
      message.text && this.sendMessage(message, conversation._id)
      message.location && this.sendLocation(message, conversation._id)
      message.image && this.sendImage(message, conversation._id)
    }
  }

  async sendMessage (message, conversationId) {
    const { token } = this.props.auth
    api.setToken(token)
    const response = await api.sendMessage({
      conversation_id: conversationId,
      type: 'text',
      text: message.text
    })
    __DEV__ && console.log('Send message response', response)
    if (response.ok) {
      this.setState({ message: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async sendLocation (message, conversationId) {
    const { token } = this.props.auth
    api.setToken(token)
    const response = await api.sendMessage({
      conversation_id: conversationId,
      type: 'location',
      location: message.location
      // text: message.text
    })
    __DEV__ && console.log('Send message response', response)
    if (response.ok) {
      this.setState({ message: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async sendImage (message, conversationId) {
    const { token } = this.props.auth
    const { image } = message
    const postResponse = await RNFetchBlob.fetch(
      'POST',
      `${Config.BASE_URL}/api/messages`,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      [
        {
          name: 'image',
          filename: image.filename || 'image.jpg',
          type: image.mime,
          data: RNFetchBlob.wrap(image.path)
        },
        { name: 'conversation_id', data: conversationId },
        { name: 'type', data: 'image' }
      ]
    )
    __DEV__ && console.log('Upload image', postResponse)
  }

  renderBubble (props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.snow
            // ...Fonts.style.description
          },
          right: {
            backgroundColor: Colors.primary
            // ...Fonts.style.description
          }
        }}
        textStyle={{
          left: {
            ...Fonts.style.description
          },
          right: {
            ...Fonts.style.description
          }
        }}
      />
    )
  }

  renderSend (props) {
    return (
      <Send
        {...props}
        containerStyle={{ height: 'auto' }}
      >
        <Image source={Images.sendButton} style={styles.sendButton} />
      </Send>
    )
  }

  renderActions (props) {
    return (
      <CustomActions
        {...props}
      />
    )
  }

  renderComposer (props) {
    return (
      <Composer {...props} textInputStyle={styles.textInput} />
    )
  }

  renderInputToolbar (props) {
    return (
      <InputToolbar
        {...props}
      />
    )
  }

  render () {
    const messages = this.state.messages.map(message => {
      message.createdAt = message.created_at
      message.image = !!message.image && url(message.image)
      if (message.type === 'location') {
        message.type = 'image'
        const { longitude, latitude } = message.location
        message.image = `https://maps.googleapis.com/maps/api/staticmap?size=200x160&scale=2&zoom=15&markers=color:red|${latitude},${longitude}`
      }
      return message
    })
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.props.auth.user._id,
            name: this.props.auth.user.name,
            avatar: url(this.props.auth.user.avatar)
          }}
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          renderActions={this.renderActions}
          renderComposer={this.renderComposer}
          renderInputToolbar={this.renderInputToolbar}
          alwaysShowSend
          submitOnReturn
          bottomOffset={0}
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={() => this.getMessages()}
          isLoadingEarlier={this.isGetData}
          isAnimated
          keyboardShouldPersistTaps={'handled'}
          minInputToolbarHeight={42}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    socket: state.socket,
    recieveMessage: state.socket.newMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(SocketActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
