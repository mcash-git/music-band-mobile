import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, Image, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import { bindActionCreators } from 'redux'
import AuthActions from '../Redux/AuthRedux'

// Styles
import styles from './Styles/ProfileEditScreenStyle'
import I18nJs from 'react-native-i18n'
import { Images, Colors } from '../Themes'
import { Actions } from 'react-native-router-flux'
import ModalFilterPicker from 'react-native-modal-filter-picker'
import DialogInput from '../Components/DialogInput'
import DialogSelect from '../Components/DialogSelect'
import Avatar from '../Components/Avatar'
import moment from 'moment'
import { url } from '../Lib/Utils'
import _ from 'lodash'
import DateTimePicker from 'react-native-modal-datetime-picker'
import config from 'react-native-config'
import Loading from 'react-native-loader-overlay'
import { showError } from '../Lib/MessageBar'
import ImageCropPicker from 'react-native-image-crop-picker'
import Api from '../Services/Api'
import RNFetchBlob from 'react-native-fetch-blob'
import Districts from '../Services/Districts'

const api = Api.create()

class ProfileEditScreen extends Component {
  constructor (props) {
    super(props)
    const user = props.auth.user.asMutable()
    this.state = {
      showProvincePicker: false,
      showDistrictPicker: false,
      isDateTimePickerVisible: false,
      name: user.name,
      birthDate: user.birth_date,
      gender: user.gender,
      province: user.province,
      district: user.district,
      selectedInstruments: user.instrument_ids || [],
      avatar: user.avatar
    }
  }

  componentWillMount () {
    Actions.refresh({
      right: () => (
        <TouchableOpacity onPress={this.onSave.bind(this)} style={styles.navButton}>
          <Text style={styles.rightButtonText}>{I18nJs.t('done')}</Text>
        </TouchableOpacity>
      )
    })
  }

  onRemoveInstrument (index) {
    let { selectedInstruments } = this.state
    selectedInstruments.splice(index, 1)
    this.setState({ selectedInstruments })
  }

  onSelectInstrumentsPress () {
    this.dialogSelect.show({
      items: this.props.instruments,
      selectedItems: this.state.selectedInstruments,
      onSubmit: (selectedInstruments) => {
        this.setState({ selectedInstruments })
        this.dialogSelect.dimiss()
      }
    })
  }

  onSelectGenderPress () {
    this.dialogGender.show({
      items: [
        { _id: 'male', name: I18nJs.t('male') },
        { _id: 'female', name: I18nJs.t('female') },
        { _id: 'other', name: I18nJs.t('other') }
      ],
      selectedItems: [this.state.gender],
      onSubmit: (selectedItems) => {
        this.setState({ gender: _.first(selectedItems) })
        this.dialogGender.dimiss()
      }
    })
  }

  onSelectBirthDate (date) {
    this.setState({ isDateTimePickerVisible: false, birthDate: moment(date).format('YYYY-MM-DD') })
  }

  async onSave () {
    if (!this.validate()) {
      return false
    }
    const { name, gender, birthDate, province, district, selectedInstruments, selectedAvatar } = this.state
    const newUser = { name, gender, birth_date: birthDate, province, district, instrument_ids: selectedInstruments }
    const { token, user } = this.props.auth
    api.setToken(token)
    this.loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    let response = await api.updateUser(user._id, newUser)
    __DEV__ && console.log('Updae user response', response)
    if (response.ok) {
      if (selectedAvatar) {
        const id = response.data.data._id
        response.data.data = await this.uploadAvatar(selectedAvatar, id)
      }
      Loading.hide(this.loader)
      await ImageCropPicker.clean()
      await this.reloadUser()
      Actions.pop()
    } else {
      Loading.hide(this.loader)
      showError(response.data)
    }
  }

  validate () {
    const { name, province, district, selectedInstruments } = this.state
    if (!name) {
      showError({ message: I18nJs.t('nameIsRequired') })
      return false
    }
    if (!province) {
      showError({ message: I18nJs.t('provinceIsRequired') })
      return false
    }
    if (!district) {
      showError({ message: I18nJs.t('districtIsRequired') })
      return false
    }
    if (!selectedInstruments.length) {
      showError({ message: I18nJs.t('instrumentIsRequired') })
      return false
    }
    return true
  }

  async uploadAvatar (avatar, id) {
    const { token } = this.props.auth
    const postResponse = await RNFetchBlob.fetch(
      'POST',
      `${config.BASE_URL}/api/users/${id}/upload`,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      [
        {
          name: 'image',
          filename: avatar.filename || 'avatar.jpg',
          type: avatar.mime,
          data: RNFetchBlob.wrap(avatar.path)
        },
        {
          name: 'is_avatar',
          data: 1
        }
      ]
    )
    __DEV__ && console.log('Upload image', postResponse)
  }

  async reloadUser () {
    let response = await api.getMe()
    __DEV__ && console.log('Reload user response', response)
    if (response.ok) {
      this.props.setAuth({ user: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async onPickImagePress () {
    try {
      const selectedAvatar = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width: 720,
        height: 720,
        loadingLabelText: I18nJs.t('processingAssets')
      })
      this.setState({ selectedAvatar })
    } catch (_) { }
  }

  render () {
    const provinces = _(Districts)
      .map('province')
      .uniq()
      .map(item => { return { key: item, label: item } })
      .value()
    const districts = _(Districts)
      .filter({ province: this.state.province })
      .map('district')
      .map(item => { return { key: item, label: item } })
      .value()

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          {this.state.selectedAvatar
            ? <Image source={{ uri: this.state.selectedAvatar.path }} style={styles.avatar} />
            : <Avatar source={this.state.avatar} size={50} />
          }
          <TouchableOpacity style={styles.changePhotoButton} onPress={() => this.onPickImagePress()}>
            <Image source={Images.cameraRed} style={styles.iconCamera} />
            <Text style={styles.changePhotoText}>{I18nJs.t('changePhoto')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fullRow}>
          <Text style={styles.groupTitle}>{I18nJs.t('bio').toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.row}
          onPress={() => this.dialogInput.show({
            text: this.state.name,
            onSubmit: (name) => {
              this.setState({ name })
              this.dialogInput.dimiss()
            }
          })}
        >
          <Text style={styles.rowTitle}>{I18nJs.t('name')}</Text>
          <Text style={styles.rowValue}>{this.state.name}</Text>
          <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => this.onSelectGenderPress()}>
          <Text style={styles.rowTitle}>{I18nJs.t('gender')}</Text>
          {this.state.gender
            ? <Text style={styles.rowValue}>{I18nJs.t(this.state.gender)}</Text>
            : <Text style={styles.placeholder}>{I18nJs.t('selectGender')}</Text>
          }
          <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => this.setState({ isDateTimePickerVisible: true })}>
          <Text style={styles.rowTitle}>{I18nJs.t('birthDate')}</Text>
          {this.state.birthDate
            ? <Text style={styles.rowValue}>{moment(this.state.birthDate).format('DD.MM.YYYY')}</Text>
            : <Text style={styles.placeholder}>{I18nJs.t('selectBirthDate')}</Text>
          }
          <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.setState({ showProvincePicker: true })}>
          <Text style={styles.rowTitle}>{I18nJs.t('province')}</Text>
          {this.state.province
            ? <Text style={styles.rowValue}>{this.state.province}</Text>
            : <Text style={styles.placeholder}>{I18nJs.t('selectProvince')}</Text>
          }
          <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.setState({ showDistrictPicker: true })}>
          <Text style={styles.rowTitle}>{I18nJs.t('district')}</Text>
          {this.state.district
            ? <Text style={styles.rowValue}>{this.state.district}</Text>
            : <Text style={styles.placeholder}>{I18nJs.t('selectDistrict')}</Text>
          }
          <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
        </TouchableOpacity>

        <View style={styles.fullRow}>
          <Text style={styles.groupTitle}>{I18nJs.t('instruments').toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.instruments}>
            {this.state.selectedInstruments && this.state.selectedInstruments.length
              ? this.state.selectedInstruments.map((selected, index) => (
                <TouchableOpacity key={selected} onPress={() => this.onRemoveInstrument(index)}>
                  <View style={styles.tag}>
                    <Image source={Images.closeButton} style={styles.closeButtonSmall} />
                    <Image source={{ uri: url(_.find(this.props.instruments, { _id: selected }).image) }} style={styles.smallIcon} />
                  </View>
                </TouchableOpacity>
              ))
              : <Text style={styles.selectInstruments}>{I18nJs.t('selectInstruments')}</Text>
            }
          </View>
          <TouchableOpacity style={{ padding: 5 }} onPress={() => this.onSelectInstrumentsPress()}>
            <Image source={Images.iconPlusRed} style={styles.plusIconSmall} />
          </TouchableOpacity>
        </View>

        <DialogInput
          ref={ref => { this.dialogInput = ref }}
          placeholder={I18nJs.t('bandName')}
          onSubmit={(text) => console.log(text)}
        />

        <DialogSelect
          ref={ref => { this.dialogSelect = ref }}
          multiple
        />

        <DialogSelect
          ref={ref => { this.dialogGender = ref }}
        />

        <ModalFilterPicker
          visible={this.state.showProvincePicker}
          onSelect={(value) => this.setState({ province: value, district: '', showProvincePicker: false })}
          onCancel={() => this.setState({ showProvincePicker: false })}
          androidUnderlineColor='transparent'
          options={provinces}
          optionTextStyle={styles.pickerText}
        />
        <ModalFilterPicker
          visible={this.state.showDistrictPicker}
          onSelect={(value) => this.setState({ district: value, showDistrictPicker: false })}
          onCancel={() => this.setState({ showDistrictPicker: false })}
          androidUnderlineColor='transparent'
          options={districts}
          optionTextStyle={styles.pickerText}
        />

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.onSelectBirthDate.bind(this)}
          onCancel={() => this.setState({ isDateTimePickerVisible: false })}
          date={moment(this.state.birthDate).toDate()}
          maximumDate={new Date()}
        />
      </ScrollView >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    instruments: state.instrument.instruments
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAuth: bindActionCreators(AuthActions.setAuth, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen)
