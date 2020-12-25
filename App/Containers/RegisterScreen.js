import React, { Component } from 'react'
import { Text, Image, View, TouchableOpacity, Platform, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'react-native-i18n'
import { Images, Colors } from '../Themes'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BottomButton from '../Components/BottomButton'

// Styles
import styles from './Styles/RegisterScreenStyle'
import RoundedInput from '../Components/RoundedInput'
import { Actions, ActionConst } from 'react-native-router-flux'
import Validator from '../Lib/Validator'
import Api from '../Services/Api'
import Loading from 'react-native-loader-overlay'
import { MessageBarManager } from 'react-native-message-bar'
import { bindActionCreators } from 'redux'
import AuthActions from '../Redux/AuthRedux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class RegisterScreen extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    error: null
  }

  onSignUpPress () {
    Keyboard.dismiss()
    const { name, email, password, password_confirmation } = this.state
    let rules = {
      name: 'required',
      email: 'required|email',
      password: 'required|confirmed'
    }
    let validation = new Validator({ name, email, password, password_confirmation }, rules)
    validation.setAttributeNames({
      name: I18n.t('name'),
      email: I18n.t('email'),
      password: I18n.t('password')
    })
    if (validation.fails()) {
      this.setState({ errors: validation.errors })
      return false
    }
    this.setState({ errors: null })
    this.onSignUp()
  }

  async onSignUp () {
    const { name, email, password } = this.state
    const api = Api.create()
    const loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    const response = await api.register({ name, email, password })
    __DEV__ && console.log('Register response', response)
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
      Actions.instrumentsScreen({})
    } else {
      const message = response.status === 422
        ? I18n.t('emailAlreadyRegistered')
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
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.centered}>
                <Image source={Images.logo} style={styles.logo} />
              </View>

              <View style={styles.middleSection} >
                <RoundedInput
                  ref='inputName'
                  value={this.state.name}
                  placeholder={I18n.t('name')}
                  icon={Images.iconContact}
                  onChangeText={text => this.setState({ name: text })}
                  error={this.state.errors && this.state.errors.first('name')}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  onSubmitEditing={() => this.refs.inputEmail.focus()}
                />
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
                  onSubmitEditing={() => this.refs.inputPasswordConfirmation.focus()}
                />
                <RoundedInput
                  ref='inputPasswordConfirmation'
                  value={this.state.password_confirmation}
                  placeholder={I18n.t('passwordConfirmation')}
                  icon={Images.iconLock}
                  onChangeText={text => this.setState({ password_confirmation: text })}
                  error={this.state.errors && this.state.errors.first('password_cofirmation')}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  secureTextEntry
                  onSubmitEditing={() => this.onSignUpPress()}
                />
              </View>
              <TouchableOpacity style={styles.bottomSection} onPress={() => Actions.loginScreen({ type: ActionConst.RESET })}>
                <Text style={styles.bottomSectionText}>{I18n.t('haveAccount')}</Text>
                <Text style={styles.signupText}>{I18n.t('signIn')}</Text>
              </TouchableOpacity>
              <BottomButton text={I18n.t('signUp')} onPress={() => this.onSignUpPress()} />
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)
