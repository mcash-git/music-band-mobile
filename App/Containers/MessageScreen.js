import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import { bindActionCreators } from 'redux'
import SocketActions from '../Redux/SocketRedux'

// Styles
import styles from './Styles/MessageScreenStyle'
import { Images } from '../Themes'
import { Actions } from 'react-native-router-flux'
import I18nJs from 'react-native-i18n'
import Searchbar from '../Components/Searchbar'
import Avatar from '../Components/Avatar'
import SquareImage from '../Components/SquareImage'
import SafeAreaView from 'react-native-safe-area-view'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import _ from 'lodash'
import moment from 'moment'

const api = Api.create()

class MessageScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bands: [],
      conversations: [],
      search: ''
    }
  }

  async componentWillMount () {
    this.props.openSocket()
    await this.getBands()
    await this.getConversations()
  }

  async getBands () {
    this.setState({ isGetData: true })
    const { token, user } = this.props.auth
    api.setToken(token)

    const query = { with: ['conversation'], limit: 20 }

    const response = await api.getUserBands(user._id, query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get bands response', response)
    if (response.ok) {
      this.setState({ bands: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async getConversations () {
    this.setState({ isGetData: true })
    const { token, user } = this.props.auth
    api.setToken(token)

    const query = { where: { type: 'private' }, with: ['users'], limit: 2000 }

    const response = await api.getConversations(user._id, query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get conversations response', response)
    if (response.ok) {
      this.setState({ conversations: response.data.data })
    } else {
      showError(response.data)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.enterTime && this.props.enterTime !== nextProps.enterTime) {
      this.getBands()
      this.getConversations()
    }
    if (nextProps.recieveMessage && nextProps.recieveMessage !== this.props.recieveMessage) {
      let isNewConversation = true
      const recieveMessage = nextProps.recieveMessage.asMutable(true)
      const conversations = this.state.conversations.map(conversation => {
        if (nextProps.recieveMessage.conversation_id === conversation._id) {
          conversation.last_message = recieveMessage
          conversation.unread_count = recieveMessage.unread_count
          isNewConversation = false
        }
        return conversation
      })
      if (isNewConversation) {
        this.getBands()
        this.getConversations()
      } else {
        this.setState({ conversations })
      }
    }
    this.forceUpdate()
  }

  renderHeader () {
    return (
      <View style={styles.header}>
        {/* <Text style={styles.lastUpdateText}>{'Updated 1 hour ago'}</Text> */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{I18nJs.t('message')}</Text>
          <TouchableOpacity style={{ marginLeft: 5 }}
            onPress={() => Actions.searchUserScreen({
              onPickUser: (user) => Actions.chatScreen({ user })
            })}>
            <Image source={Images.iconPlus} style={styles.iconSmall} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderBand ({ item }) {
    return (
      <TouchableOpacity onPress={() => Actions.chatScreen({ band: item, conversation: item.conversation })} style={styles.row}>
        <SquareImage source={item.cover} size={40} />
        <View style={{ flex: 1 }}>
          <View style={styles.subRow}>
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.chatTime}>{!!item.conversation && !!item.conversation.last_message && moment.utc(item.conversation.last_message.created_at).fromNow()}</Text>
          </View>

          <View style={styles.subRow}>
            <Text style={styles.lastMessage}>{!!item.conversation && !!item.conversation.last_message && item.conversation.last_message.text}</Text>
            {!!item.conversation && !!item.conversation.unread_count && !!item.conversation.unread_count[this.props.auth.user._id] && (
              <View style={styles.unread}>
                <Text style={styles.unreadText}>{item.conversation.unread_count[this.props.auth.user._id]}</Text>
              </View>
            )}
          </View>
        </View >
      </TouchableOpacity>
    )
  }

  renderPersonal ({ item }) {
    const user = _.find(item.users, user => user._id !== this.props.auth.user._id)
    return (
      <TouchableOpacity onPress={() => Actions.chatScreen({ conversation: item, user })} style={styles.row}>
        <Avatar source={user.avatar} size={40} />
        <View style={{ flex: 1 }}>
          <View style={styles.subRow}>
            <Text style={styles.chatName}>{user.name}</Text>
            <Text style={styles.chatTime}>{!!item.last_message && moment.utc(item.last_message.created_at).fromNow()}</Text>
          </View>

          <View style={styles.subRow}>
            <Text style={styles.lastMessage}>{item.last_message ? item.last_message.text : ''}</Text>
            {!!item.unread_count && !!item.unread_count[this.props.auth.user._id] && (
              <View style={styles.unread}>
                <Text style={styles.unreadText}>{item.unread_count[this.props.auth.user._id]}</Text>
              </View>
            )}
          </View>
        </View >
      </TouchableOpacity>
    )
  }

  render () {
    let { bands, conversations, search } = this.state
    bands = search ? _.filter(bands, band => new RegExp(`.*${search}.*`, 'i').test(band.name)) : bands
    conversations = search
      ? _.filter(conversations, conversation => {
        const user = _.find(conversation.users, user => user._id !== this.props.auth.user._id)
        return user && new RegExp(`.*${search}.*`, 'i').test(conversation.name)
      })
      : conversations
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          {this.renderHeader()}
          <View style={styles.searchBlock}>
            <Searchbar
              onChangeText={(search) => this.setState({ search })}
              value={this.state.search}
              placeholder={I18nJs.t('searchForConversation')}
            />
          </View>
          <ScrollView style={styles.main}>
            <Text style={styles.title}>{I18nJs.t('myBands')}</Text>
            <FlatList
              data={bands}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderBand.bind(this)}
            />
            <Text style={styles.title}>{I18nJs.t('personal')}</Text>
            <FlatList
              data={conversations}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderPersonal.bind(this)}
            />
          </ScrollView>
        </View>
      </SafeAreaView >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    recieveMessage: state.socket.newMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(SocketActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen)
