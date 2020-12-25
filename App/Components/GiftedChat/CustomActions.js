import PropTypes from 'prop-types'
import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Text,
  Image
} from 'react-native'

import { Colors, Images } from '../../Themes'
import I18nJs from 'react-native-i18n'
import ImageCropPicker from 'react-native-image-crop-picker'
import { ConfirmDialog } from 'react-native-simple-dialogs'
import { showError } from '../../Lib/MessageBar'

export default class CustomActions extends React.Component {
  state = {
    dialogVisible: false
  }

  onPickLoation () {
    this.setState({ dialogVisible: false })
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.onSend({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
      },
      (error) => showError({ message: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  async onPickImagePress () {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        multiple: false,
        compressImageMaxWidth: 720,
        compressImageMaxHeight: 720,
        loadingLabelText: I18nJs.t('processingAssets')
      })
      image && this.props.onSend({ image })
    } catch (_) { }
  }

  async onOpenCameraPress () {
    try {
      const image = await ImageCropPicker.openCamera({
        multiple: false,
        compressImageMaxWidth: 720,
        compressImageMaxHeight: 720,
        loadingLabelText: I18nJs.t('processingAssets')
      })
      image && this.props.onSend({ image })
    } catch (_) { }
  }

  onButtonImagePress () {
    const options = [I18nJs.t('openCamera'), I18nJs.t('openGallery'), I18nJs.t('cancel')]
    const cancelButtonIndex = options.length - 1
    this.context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, (index) => {
      index === 0 && this.onOpenCameraPress()
      index === 1 && this.onPickImagePress()
    })
  }

  render () {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          style={styles.wrapper}
          onPress={this.onButtonImagePress.bind(this)}
        >
          <Image source={Images.imageButton} style={styles.button} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wrapper}
          onPress={() => this.setState({ dialogVisible: true })}
        >
          <Image source={Images.locationButton} style={styles.button} />
        </TouchableOpacity>
        <ConfirmDialog
          title={I18nJs.t('musicBands')}
          message={I18nJs.t('sendLocation')}
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({ dialogVisible: false })}
          positiveButton={{
            title: I18nJs.t('send'),
            onPress: () => this.onPickLoation()
          }}
          negativeButton={{
            title: I18nJs.t('cancel'),
            onPress: () => this.setState({ dialogVisible: false })
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // width: 30,
    // height: 30,
    // marginLeft: 10,
    marginBottom: 10,
    flexDirection: 'row'
  },
  wrapper: {
    paddingLeft: 10
    // borderRadius: 15,
    // borderColor: Colors.primary,
    // borderWidth: 2,
    // flex: 1
  },
  button: {
    height: 30,
    width: 30,
    borderRadius: 15
  },
  iconText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 19,
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
})

CustomActions.contextTypes = {
  actionSheet: PropTypes.func
}

CustomActions.defaultProps = {
  onSend: () => { },
  options: {},
  icon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {}
}

CustomActions.propTypes = {
  onSend: PropTypes.func,
  options: PropTypes.object,
  icon: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  iconTextStyle: Text.propTypes.style
}
