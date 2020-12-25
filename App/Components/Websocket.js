import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import Ws from '@adonisjs/websocket-client'
import config from 'react-native-config'
import { bindActionCreators } from 'redux'
import SocketActions from '../Redux/SocketRedux'

export class Websocket extends Component {
  constructor (props) {
    super(props)
    this.ws = Ws(config.WS_URL)
  }

  componentWillMount () {
    this.ws.on('open', () => {
      this.props.socketState('open')
      const { user } = this.props.auth

      this.topic = this.ws.getSubscription(`chat:${user._id}`)
      if (!this.topic) {
        this.ws.subscribe(`chat:${user._id}`)
        this.topic = this.ws.getSubscription(`chat:${user._id}`)
      }
      this.topic.on('ready', () => console.log('owner ready'))
      this.topic.on('message', message => this.props.newMessage(message))
    })

    this.ws.on('close', () => {
      this.props.socketState('close')
    })
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.socket.open && nextProps.socket.open) {
      this.connectSocket()
    }
    if (this.props.socket.open && !nextProps.socket.open) {
      // this.ws && this.ws.close()
    }
  }

  connectSocket () {
    const { token } = this.props.auth
    this.ws.withJwtToken(token).connect()
  }

  render () {
    return (
      <View />
    )
  }
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    socket: state.socket
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(SocketActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Websocket)
