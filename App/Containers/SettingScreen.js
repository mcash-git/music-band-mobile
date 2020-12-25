import React, { Component } from 'react'
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AuthActions from '../Redux/AuthRedux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SettingScreenStyle'
import I18nJs from 'react-native-i18n'
import { Images } from '../Themes'
import { Actions, ActionConst } from 'react-native-router-flux'
import Avatar from '../Components/Avatar'
import { ConfirmDialog } from 'react-native-simple-dialogs'
import Api from '../Services/Api'

const api = Api.create()

class SettingScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dialogVisible: false
    }
  }

  async signOut () {
    if (this.props.auth.deviceToken) {
      api.setToken(this.props.auth.token)
      const response = await api.removeDeviceToken(this.props.auth.deviceToken)
      __DEV__ && console.log('logout response', response)
    }
    Actions.loginScreen({ type: ActionConst.RESET })
    this.props.logout()
  }

  render () {
    const { user } = this.props.auth
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{I18nJs.t('settings')}</Text>
          <Avatar source={!!user && user.avatar} size={30} />
        </View>
        <ScrollView>
          <View style={styles.separate} />
          <TouchableOpacity style={styles.row} onPress={Actions.profileEditScreen}>
            <Image source={Images.iconContact} style={styles.iconSmall} />
            <Text style={styles.rowTitle}>{I18nJs.t('profile')}</Text>
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Image source={Images.iconNotification} style={styles.iconSmall} />
            <Text style={styles.rowTitle}>{I18nJs.t('notification')}</Text>
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
          </TouchableOpacity>

          <View style={styles.separate} />

          <TouchableOpacity style={styles.row}>
            <Image source={Images.iconLibrary} style={styles.iconSmall} />
            <Text style={styles.rowTitle}>{I18nJs.t('library')}</Text>
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Image source={Images.iconBookmark} style={styles.iconSmall} />
            <Text style={styles.rowTitle}>{I18nJs.t('bookmark')}</Text>
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
          </TouchableOpacity>

          <View style={styles.separate} />

          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>{I18nJs.t('tellAFriend')}</Text>
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>{I18nJs.t('about')}</Text>
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>{I18nJs.t('termsOfUse')}</Text>
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowTitle}>{I18nJs.t('privacyPolicy')}</Text>
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
          </TouchableOpacity>

          <View style={styles.separate} />

          <TouchableOpacity style={styles.row} onPress={() => this.setState({ dialogVisible: true })}>
            <Text style={styles.rowTitle}>{I18nJs.t('signOut')}</Text>
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
          </TouchableOpacity>
        </ScrollView>
        <ConfirmDialog
          title={I18nJs.t('musicBands')}
          message={I18nJs.t('areYouWantToLogOut')}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({ dialogVisible: false })}
          positiveButton={{
            title: I18nJs.t('yes'),
            onPress: () => this.signOut()
          }}
          negativeButton={{
            title: I18nJs.t('no'),
            onPress: () => this.setState({ dialogVisible: false })
          }}
        />
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
    logout: bindActionCreators(AuthActions.logout, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen)
