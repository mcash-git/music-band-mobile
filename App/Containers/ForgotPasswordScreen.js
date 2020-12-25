import React, { Component } from 'react'
import { Text, Image, View, TouchableOpacity, Platform, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import I18n from 'react-native-i18n'
import { Images } from '../Themes'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BottomButton from '../Components/BottomButton'

// Styles
import styles from './Styles/ForgotPasswordScreenStyle'
import RoundedInput from '../Components/RoundedInput'
import { Actions, ActionConst } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class ForgotPasswordScreen extends Component {
  state = {
    email: '',
    error: {
      // email: 'Email is required'
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
              <TouchableOpacity style={styles.backButton} onPress={Actions.pop}>
                <Image source={Images.back} style={styles.icon} />
              </TouchableOpacity>
              <View style={styles.centered}>
                <Image source={Images.logo} style={styles.logo} />
              </View>

              <View style={styles.middleSection} >
                <RoundedInput
                  value={this.state.email}
                  placeholder={I18n.t('email')}
                  icon={Images.iconMail}
                  onChangeText={text => this.setState({ email: text })}
                  error={this.state.error.email}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  keyboardType={'email-address'}
                />
              </View>

              <BottomButton text={I18n.t('sendEmail')} onPress={Actions.pop} />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen)
