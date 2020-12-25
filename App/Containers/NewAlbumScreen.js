import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, Keyboard, FlatList, ScrollView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/NewAlbumScreenStyle'
import { Actions } from 'react-native-router-flux'
import { Images, Colors } from '../Themes'
import DialogSelect from '../Components/DialogSelect'
import I18nJs from 'react-native-i18n'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImageCropPicker from 'react-native-image-crop-picker'
import { url } from '../Lib/Utils'
import _ from 'lodash'
import Loading from 'react-native-loader-overlay'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import config from 'react-native-config'
import RNFetchBlob from 'react-native-fetch-blob'

const api = Api.create()

class NewAlbumScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cover: null,
      name: '',
      description: '',
      selectedInstruments: [],
      bands: [],
      band: null
    }
  }

  componentWillMount () {
    Actions.refresh({
      right: this.rightButton()
    })

    this.getBands()
  }

  rightButton () {
    return (
      <TouchableOpacity onPress={() => this.onSubmit()}>
        <Image source={Images.flyPaper} style={styles.sendButton} />
      </TouchableOpacity>
    )
  }

  async getBands (isRefreshing) {
    this.setState({ isGetData: true })
    const { user, token } = this.props.auth
    api.setToken(token)

    const query = { with: ['users'] }

    const response = await api.getUserBands(user._id, query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('getBands response', response)
    if (response.ok) {
      let band = null
      if (response.data.data.length) {
        band = response.data.data[0]
      }
      this.setState({ bands: response.data.data, band })
    } else {
      showError(response.data)
    }
  }

  async onSubmit () {
    Keyboard.dismiss()
    const { name, cover, description, selectedInstruments, band } = this.state
    if (!name) {
      showError({ message: I18nJs.t('enterAlbumName') })
      return false
    }
    const { token } = this.props.auth
    api.setToken(token)
    this.loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    let response = await api.addAlbum({ name, description, instrument_ids: selectedInstruments, band_id: band ? band._id : null })
    __DEV__ && console.log('Create Album response', response)
    if (response.ok) {
      if (cover) {
        const id = response.data.data._id
        await this.uploadAlbumCover(cover, id)
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

  async uploadAlbumCover (cover, id) {
    const { token } = this.props.auth
    const postResponse = await RNFetchBlob.fetch(
      'POST',
      `${config.BASE_URL}/api/albums/${id}/image`,
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

  async onCoverPress () {
    try {
      const cover = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        width: 720,
        height: 720,
        cropping: true,
        loadingLabelText: I18nJs.t('processingAssets')
      })
      this.setState({ cover })
    } catch (_) { }
  }

  onSelectBandPress () {
    this.dialogSelectBand.show({
      items: this.state.bands,
      selectedItems: this.state.band ? [this.state.band._id] : [],
      onSubmit: (selectedInstruments) => {
        const band = _.find(this.state.bands, { _id: selectedInstruments[0] })
        this.setState({ band })
        this.dialogSelectBand.dimiss()
      }
    })
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

  onRemoveInstrument (index) {
    let { selectedInstruments } = this.state
    selectedInstruments.splice(index, 1)
    this.setState({ selectedInstruments })
  }

  renderItem ({ item, index }) {
    return (
      <View style={styles.row}>
        <Text>{index + 1}</Text>
        <Text style={styles.songTitle}>{item.name}</Text>
        <TouchableOpacity>
          <Image source={Images.closeButton} style={styles.closeButton} />
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.albumInputs}>
          <View style={styles.addCoverBlock}>
            <View style={styles.coverDisk} />
            <TouchableOpacity style={styles.addCoverButton} onPress={() => this.onCoverPress()}>
              {this.state.cover
                ? <Image style={styles.albumCover} source={{ uri: this.state.cover.path }} />
                : null
              }
              {this.state.cover ? <View style={styles.addCoverOverlay} /> : null}
              <Image source={Images.iconImage} style={styles.addCoverIcon} />
              <Text style={styles.addCoverText}>{I18nJs.t('addCover')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.onSelectBandPress()}>
              {this.state.band
                ? <Text style={styles.bandName}>{this.state.band.name}</Text>
                : <Text style={styles.selectBand}>{I18nJs.t('yourBand')}</Text>
              }
            </TouchableOpacity>
            <AutoGrowingTextInput
              multiline
              placeholder={I18nJs.t('albumName')}
              style={styles.inputAlbumName}
              underlineColorAndroid='transparent'
              value={this.state.name}
              onChange={event => this.setState({ name: event.nativeEvent.text || '' })}
            />
          </View>
        </View>
        <AutoGrowingTextInput
          multiline
          placeholder={I18nJs.t('addDescription')}
          style={styles.inputDescription}
          underlineColorAndroid='transparent'
          value={this.state.description}
          onChange={event => this.setState({ description: event.nativeEvent.text || '' })}
        />
        <View style={styles.instrumentsView}>
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
        {/* <TouchableOpacity style={styles.row}>
            <Image source={Images.iconPlusRed} style={styles.plusIconSmall} />
            <Text style={styles.addSongText}>{I18nJs.t('addNewSong')}</Text>
          </TouchableOpacity> */}
        {/* <FlatList
            data={songs}
            keyExtractor={(item, index) => index}
            renderItem={this.renderItem.bind(this)}
          /> */}

        <View style={styles.members}>
          {/* <View style={styles.member}>
            <TouchableOpacity style={styles.addMember}>
              <Image source={Images.iconPlusRed} style={styles.plusIcon} />
            </TouchableOpacity>
            <Text style={styles.addMemberText}>{I18nJs.t('addNew')}</Text>
          </View> */}
          <FlatList
            data={this.state.band ? this.state.band.users : []}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            style={{ flex: 1 }}
            renderItem={({ item }) => (
              <View style={styles.member}>
                <TouchableOpacity style={styles.addMember}>
                  <Image source={{ uri: url(item.avatar) }} style={styles.memberAvatar} />
                </TouchableOpacity>
                <Text style={styles.memberName}>{item.name}</Text>
              </View>
            )}
          />
        </View>
        <DialogSelect
          ref={ref => { this.dialogSelect = ref }}
          multiple
        />
        <DialogSelect
          ref={ref => { this.dialogSelectBand = ref }}
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

export default connect(mapStateToProps, mapDispatchToProps)(NewAlbumScreen)
