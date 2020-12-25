import React, { Component } from 'react'
import { Text, Image, View, TouchableOpacity, Platform, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'react-native-i18n'
import { Images, Colors } from '../Themes'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BottomButton from '../Components/BottomButton'

// Styles
import styles from './Styles/LaunchScreenStyles'
import RoundedButton from '../Components/RoundedButton'
import { Actions, ActionConst } from 'react-native-router-flux'
import { bindActionCreators } from 'redux'
import AuthActions from '../Redux/AuthRedux'
import InstrumentActions from '../Redux/InstrumentRedux'
import Loading from 'react-native-loader-overlay'
import Api from '../Services/Api'
import { MessageBarManager } from 'react-native-message-bar'
import FCM, { NotificationActionType } from 'react-native-fcm'
// import * as WeChat from 'react-native-wechat'
// import * as QQAPI from 'react-native-qq'

// WeChat.registerApp('appid')
const api = Api.create()

class LaunchScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      ready: false
    }
  }

  componentWillMount () {
    this.loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
  }

  componentDidMount () {
    this.startup(this.props)
  }

  componentWillReceiveProps (newProps) {
    this.forceUpdate()
    this.startup(newProps)
  }

  async startup (props) {
    if (!props.startup.loading && this.state.isLoading) {
      this.setState({ isLoading: false })
      await this.registerFCM()
      await this.getInstruments()
      if (props.auth.refreshToken) {
        await this.refreshToken(props.auth.refreshToken)
      } else {
        setTimeout(() => {
          this.setState({ ready: true })
        }, 300)
      }
      Loading.hide(this.loader)
    }
  }

  async wechatLogin () {
    // const result = await WeChat.sendAuthRequest('get_simple_userinfo')
    // console.log(result)
  }

  async qqLogin () {
    // const result = await QQAPI.login('get_simple_userinfo')
    // console.log(result)
  }

  async refreshToken (refreshToken) {
    const response = await api.refreshToken(refreshToken)
    __DEV__ && console.log('Refresh token response', response)
    if (response.ok) {
      const auth = response.data
      api.setToken(auth.token)
      const userResponse = await api.getMe()
      __DEV__ && console.log('get me response', userResponse)
      if (userResponse.ok) {
        const user = userResponse.data.data
        auth.user = user
        this.props.setAuth(auth)
        if (user.instrument_ids) {
          Actions.lightbox({ type: ActionConst.RESET })
        } else {
          Actions.instrumentsScreen({ type: ActionConst.RESET })
        }
      } else {
        setTimeout(() => {
          this.setState({ ready: true })
        }, 300)
      }
    } else if (response.status !== 401) {
      MessageBarManager.showAlert({
        title: I18n.t('musicBands'),
        message: I18n.t('cannotConnectToServer'),
        alertType: 'error'
      })
      setTimeout(() => {
        this.setState({ ready: true })
      }, 300)
    } else {
      setTimeout(() => {
        this.setState({ ready: true })
      }, 300)
    }
  }

  async getInstruments () {
    const response = await api.getInstruments()
    __DEV__ && console.log('Get Instruments response', response)
    if (response.ok) {
      this.props.setInstruments(response.data.data)
    } else {
      MessageBarManager.showAlert({
        title: I18n.t('musicBands'),
        message: I18n.t('cannotConnectToServer'),
        alertType: 'error'
      })
    }
  }

  async registerFCM () {
    const notif = await FCM.getInitialNotification()
    this.setState({ initNotif: notif })

    try {
      await FCM.requestPermissions({ badge: false, sound: true, alert: true })
    } catch (e) {
      console.error(e)
    }

    let token = await FCM.getFCMToken()
    console.log('TOKEN (getFCMToken)', token)
    token && this.props.setDeviceToken(token)

    if (Platform.OS === 'ios') {
      token = await FCM.getAPNSToken()
      console.log('APNS TOKEN (getFCMToken)', token)
      token && this.props.setDeviceToken(token)
    }

    // topic example
    // FCM.subscribeToTopic('sometopic')
    // FCM.unsubscribeFromTopic('sometopic')
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' && <StatusBar barStyle='dark-content' />}
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <View style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.logo} style={styles.logo} />
          </View>

          {this.state.ready && (
            <View style={styles.middleSection} >
              <RoundedButton text={I18n.t('signIn')} onPress={Actions.loginScreen} />
              <Text style={styles.sectionText}>{I18n.t('orSignInWith')}</Text>
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.socialButton} onPress={this.wechatLogin.bind(this)}>
                  <Image source={Images.iconWechat} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={this.qqLogin.bind(this)}>
                  <Image source={Images.iconQQ} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {this.state.ready && <BottomButton onPress={Actions.registerScreen} text={I18n.t('signUp')} />}
          {this.state.ready && <Text style={styles.bottomSectionText}>{I18n.t('haveNoAccount')}</Text>}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    startup: state.startup,
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(AuthActions, dispatch),
    ...bindActionCreators(InstrumentActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
