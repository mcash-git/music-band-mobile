import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, Keyboard } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/BandCreateScreenStyle'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import I18nJs from 'react-native-i18n'
import { Images, Colors } from '../Themes'
import ModalFilterPicker from 'react-native-modal-filter-picker'
import DialogInput from '../Components/DialogInput'
import DialogSelect from '../Components/DialogSelect'
import DialogTag from '../Components/DialogTag'
import { url } from '../Lib/Utils'
import _ from 'lodash'
import config from 'react-native-config'
import Loading from 'react-native-loader-overlay'
import { Actions } from 'react-native-router-flux'
import { showError } from '../Lib/MessageBar'
import ImageCropPicker from 'react-native-image-crop-picker'
import Api from '../Services/Api'
import RNFetchBlob from 'react-native-fetch-blob'
import Districts from '../Services/Districts'
import Genres from '../Services/Genres'

const api = Api.create()

class BandCreateScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showProvincePicker: false,
      showDistrictPicker: false,
      genres: [],
      name: '',
      province: '',
      district: '',
      selectedInstruments: []
    }
  }

  componentWillMount () {
    Actions.refresh({
      right: this.rightButton()
    })
  }

  rightButton () {
    return (
      <TouchableOpacity onPress={() => this.onSubmit()}>
        <Image source={Images.flyPaper} style={styles.sendButton} />
      </TouchableOpacity>
    )
  }

  async onSubmit () {
    Keyboard.dismiss()
    if (!this.validate()) { return false }
    const { name, cover, genres, province, district, selectedInstruments } = this.state
    const { token } = this.props.auth
    api.setToken(token)
    this.loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    let response = await api.addBand({ name, genres, province, district, instrument_ids: selectedInstruments })
    __DEV__ && console.log('Create Band response', response)
    if (response.ok) {
      if (cover) {
        const id = response.data.data._id
        await this.uploadBandCover(cover, id)
      }
      Loading.hide(this.loader)
      await ImageCropPicker.clean()
      Actions.pop()
      this.props.getAlbums && this.props.getAlbums()
    } else {
      Loading.hide(this.loader)
      showError(response.data)
    }
  }

  validate () {
    const { name, genres, province, district, selectedInstruments } = this.state
    if (!name) {
      showError({ message: I18nJs.t('bandNameIsRequired') })
      return false
    }
    if (!genres.length) {
      showError({ message: I18nJs.t('genreIsRequired') })
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

  async uploadBandCover (cover, id) {
    const { token } = this.props.auth
    const postResponse = await RNFetchBlob.fetch(
      'POST',
      `${config.BASE_URL}/api/bands/${id}/image`,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      [
        {
          name: 'cover',
          filename: cover.filename || 'cover.jpg',
          type: cover.mime,
          data: RNFetchBlob.wrap(cover.path)
        }
      ]
    )
    __DEV__ && console.log('Upload image', postResponse)
  }

  async onPickImagePress () {
    try {
      const cover = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width: 720,
        height: 720,
        loadingLabelText: I18nJs.t('processingAssets')
      })
      this.setState({ cover })
    } catch (_) { }
  }

  onSelectGenres (genres) {
    this.setState({ genres })
    this.dialogTag.dimiss()
  }

  onChanceName (name) {
    if (name) {
      this.setState({ name })
      this.dialogInput.dimiss()
    }
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

  onSelectGenresPress () {
    this.dialogSelect.show({
      items: Genres.map(genre => { return { _id: genre, name: genre } }),
      selectedItems: this.state.genres,
      onSubmit: (selectedGenres) => {
        this.setState({ genres: selectedGenres })
        this.dialogSelect.dimiss()
      }
    })
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
      <KeyboardAwareScrollView style={styles.mainContainer}>
        <Text style={styles.title}>{I18nJs.t('createABand')}</Text>
        <View style={styles.header}>
          {!!this.state.cover && (
            <Image source={{ uri: this.state.cover.path }} style={styles.cover} />
          )}
          <TouchableOpacity onPress={this.onPickImagePress.bind(this)}>
            <Image source={Images.cameraRed} style={styles.camera} />
          </TouchableOpacity>
          <Text style={styles.cameraText}>{I18nJs.t('addCoverPhoto')}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.groupLabel}>{I18nJs.t('info').toUpperCase()}</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => this.dialogInput.show({
              text: this.state.name,
              onSubmit: text => this.onChanceName(text)
            })}>
            <Text style={styles.label}>{I18nJs.t('name')}</Text>
            {this.state.name
              ? <Text style={styles.value}>{this.state.name}</Text>
              : <Text style={styles.placeholder}>{I18nJs.t('enterBandName')}</Text>
            }
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => this.onSelectGenresPress()}>
            <Text style={styles.label}>{I18nJs.t('genre')}</Text>
            {this.state.genres.length
              ? <Text style={styles.value}>{this.state.genres.map(item => `#${item}`).join(' ')}</Text>
              : <Text style={styles.placeholder}>{I18nJs.t('selectGenre')}</Text>
            }
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => this.setState({ showProvincePicker: true })}>
            <Text style={styles.label}>{I18nJs.t('province')}</Text>
            {this.state.province
              ? <Text style={styles.value}>{this.state.province}</Text>
              : <Text style={styles.placeholder}>{I18nJs.t('selectProvince')}</Text>
            }
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => this.setState({ showDistrictPicker: true })}>
            <Text style={styles.label}>{I18nJs.t('district')}</Text>
            {this.state.district
              ? <Text style={styles.value}>{this.state.district}</Text>
              : <Text style={styles.placeholder}>{I18nJs.t('selectDistrict')}</Text>
            }
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
          </TouchableOpacity>
        </View>

        <View style={styles.instrumentsGroup}>
          <Text style={styles.groupLabel}>{I18nJs.t('instruments').toUpperCase()}</Text>
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
        </View>

        {/* <View style={styles.membersGroup}>
          <Text style={styles.groupLabel}>{I18nJs.t('members').toUpperCase()}</Text>
          <View style={styles.members}>
            <View style={styles.member}>
              <TouchableOpacity style={styles.addMember}>
                <Image source={Images.iconPlusRed} style={styles.plusIcon} />
              </TouchableOpacity>
              <Text style={styles.addMemberText}>{I18nJs.t('addNew')}</Text>
            </View>
            <ScrollView horizontal style={{ flex: 1 }}>
              <View style={styles.member}>
                <TouchableOpacity style={styles.addMember}>
                  <Image source={{ uri: 'https://www.japantimes.co.jp/wp-content/uploads/2017/06/n-dj-a-20170531.jpg' }} style={styles.memberAvatar} />
                </TouchableOpacity>
                <Text style={styles.memberName}>{'Cui Jian'}</Text>
              </View>
              <View style={styles.member}>
                <TouchableOpacity style={styles.addMember}>
                  <Image source={{ uri: 'https://www.japantimes.co.jp/wp-content/uploads/2017/06/n-dj-a-20170531.jpg' }} style={styles.memberAvatar} />
                </TouchableOpacity>
                <Text style={styles.memberName}>{'Cui Jian'}</Text>
              </View>
              <View style={styles.member}>
                <TouchableOpacity style={styles.addMember}>
                  <Image source={{ uri: 'https://www.japantimes.co.jp/wp-content/uploads/2017/06/n-dj-a-20170531.jpg' }} style={styles.memberAvatar} />
                </TouchableOpacity>
                <Text style={styles.memberName}>{'Cui Jian'}</Text>
              </View>
            </ScrollView>
          </View>
        </View> */}

        <DialogInput
          ref={ref => { this.dialogInput = ref }}
          placeholder={I18nJs.t('bandName')}
          onSubmit={(text) => console.log(text)}
        />

        <DialogSelect
          ref={ref => { this.dialogSelect = ref }}
          multiple
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
      </KeyboardAwareScrollView>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandCreateScreen)
