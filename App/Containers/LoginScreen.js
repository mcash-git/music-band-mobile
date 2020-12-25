import React, { Component } from 'react'
import { Text, Image, View, TouchableOpacity, Platform, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'react-native-i18n'
import { Images, Colors } from '../Themes'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BottomButton from '../Components/BottomButton'

// Styles
import styles from './Styles/LoginScreenStyle'
import RoundedInput from '../Components/RoundedInput'
import { Actions, ActionConst } from 'react-native-router-flux'
import Validator from '../Lib/Validator'
import Api from '../Services/Api'
import Loading from 'react-native-loader-overlay'
import { MessageBarManager } from 'react-native-message-bar'
import { bindActionCreators } from 'redux'
import AuthActions from '../Redux/AuthRedux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const api = Api.create()

class LoginScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      errors: null
    }
  }

  onSignInPress () {
    const { email, password } = this.state
    let rules = {
      email: 'required|email',
      password: 'required'
    }
    let validation = new Validator({ email, password }, rules)
    validation.setAttributeNames({
      email: I18n.t('email'),
      password: I18n.t('password')
    })
    if (validation.fails()) {
      this.setState({ errors: validation.errors })
      return false
    }
    this.setState({ errors: null })
    this.onSignIn()
  }

  async onSignIn () {
    const { email, password } = this.state
    const loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    const response = await api.login(email, password)
    __DEV__ && console.log('Login response', response)
    Loading.hide(loader)
    if (response.ok) {
      const auth = response.data.data
      this.props.setAuth(auth)
      if (this.props.auth.deviceToken) {
        api.setToken(auth.token)
        api.registerDeviceToken({ device_token: this.props.auth.deviceToken, device_type: Platform.OS }).then(response =>
          __DEV__ && console.log('register device token', response)
        )
      }
      if (auth.user.instrument_ids) {
        Actions.lightbox({ type: ActionConst.RESET })
      } else {
        Actions.instrumentsScreen({})
      }
    } else {
      const message = response.status === 401
        ? I18n.t('invalidEmailOrPassword')
        : I18n.t('cannotConnectToServer')
      MessageBarManager.showAlert({
        title: I18n.t('musicBands'),
        message,
        alertType: 'error'
      })
    }
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' && <StatusBar barStyle='dark-content' />}
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.containerContent}>
              <View style={styles.centered}>
                <Image source={Images.logo} style={styles.logo} />
              </View>

              <View style={styles.middleSection} >
                <RoundedInput
                  ref='inputEmail'
                  value={this.state.email}
                  placeholder={I18n.t('email')}
                  icon={Images.iconMail}
                  onChangeText={text => this.setState({ email: text })}
                  error={this.state.errors && this.state.errors.first('email')}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  keyboardType={'email-address'}
                  onSubmitEditing={() => this.refs.inputPassword.focus()}
                />
                <RoundedInput
                  ref='inputPassword'
                  value={this.state.password}
                  placeholder={I18n.t('password')}
                  icon={Images.iconLock}
                  onChangeText={text => this.setState({ password: text })}
                  error={this.state.errors && this.state.errors.first('password')}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  secureTextEntry
                  onSubmitEditing={() => this.onSignInPress()}
                />
                <TouchableOpacity onPress={Actions.forgotPasswordScreen}>
                  <Text style={styles.sectionText}>{I18n.t('forgotPassword')}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.bottomSection} onPress={() => Actions.registerScreen({ type: ActionConst.RESET })}>
                <Text style={styles.bottomSectionText}>{I18n.t('haveNoAccount')}</Text>
                <Text style={styles.signupText}>{I18n.t('signUp')}</Text>
              </TouchableOpacity>
              <BottomButton text={I18n.t('signIn')} onPress={() => this.onSignInPress()} />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
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
  return bindActionCreators(AuthActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
