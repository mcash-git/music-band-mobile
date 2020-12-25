import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, FlatList, Keyboard } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/NewPostScreenStyle'
import { Actions } from 'react-native-router-flux'
import { Images, Colors } from '../Themes'
import PlayIcon from '../Components/PlayIcon'
import Avatar from '../Components/Avatar'
import I18nJs from 'react-native-i18n'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-crop-picker'
import ActionSheet from 'react-native-actionsheet'
import Api from '../Services/Api'
import { showError } from '../Lib/MessageBar'
import RNFetchBlob from 'react-native-fetch-blob'
import config from 'react-native-config'
import Loading from 'react-native-loader-overlay'
import RNThumbnail from 'react-native-thumbnail'
import DialogInput from '../Components/DialogInput'
import DialogTag from '../Components/DialogTag'
import _ from 'lodash'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import VideoPlayer from 'react-native-video-player'
import Video from 'react-native-video'
import { DoubleBounce } from 'react-native-loader'
import { url } from '../Lib/Utils'

const api = Api.create()

class NewPostScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      songs: [],
      albums: [],
      images: [],
      text: '',
      selectedAlbum: null
    }
  }

  async componentWillMount () {
    Actions.refresh({
      right: this.rightButton()
    })
    await this.getAlbums()
  }

  rightButton () {
    return (
      <TouchableOpacity onPress={this.onSubmit.bind(this)}>
        <Image source={Images.flyPaper} style={styles.sendButton} />
      </TouchableOpacity>
    )
  }

  async getAlbums () {
    this.setState({ isGetData: true })
    const { token } = this.props.auth
    api.setToken(token)

    const query = {

    }

    const response = await api.getAlbums(query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get albums response', response)
    if (response.ok) {
      const albums = response.data.data
      this.setState({ albums })
    } else {
      showError(response.data)
    }
  }

  async onSubmit () {
    Keyboard.dismiss()
    const { text, images, songs } = this.state
    if (!text && !images.length && !songs.length) {
      return false
    }
    for (let song of songs) {
      if (!song.name) {
        showError({ message: I18nJs.t('enterSongName') })
        return false
      }
    }
    const { token } = this.props.auth
    api.setToken(token)
    this.loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    let response = await api.addPost({ text })
    __DEV__ && console.log('Create post response', response)
    if (response.ok) {
      if (images.length) {
        const id = response.data.data._id
        try {
          for (let image of images) {
            await this.uploadImage(image, id)
          }
        } catch (error) {
          showError(error)
        }
      }
      if (songs.length) {
        const id = response.data.data._id

        try {
          for (let song of songs) {
            await this.uploadSong(song, id)
          }
        } catch (error) {
          showError(error)
        }
      }
      Loading.hide(this.loader)
      await ImagePicker.clean()
      Actions.pop()
      this.props.refreshData && this.props.refreshData()
    } else {
      Loading.hide(this.loader)
      showError(response.data)
    }
  }

  async uploadImage (image, id) {
    const { token } = this.props.auth
    const postResponse = await RNFetchBlob.fetch(
      'POST',
      `${config.BASE_URL}/api/posts/${id}/images`,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      [
        {
          name: 'image',
          filename: image.filename || 'image.jpg',
          type: image.mime,
          data: RNFetchBlob.wrap(image.path)
        },
        { name: 'caption', data: image.caption || '' }
      ]
    )
    __DEV__ && console.log('Upload image', postResponse)
  }

  async uploadSong (song, id) {
    const { token } = this.props.auth
    const { albumId, albums } = this.state
    const fields = [
      {
        name: 'song',
        filename: song.filename || /video\//.test(song.mime) ? 'video.mp4' : 'audio.mp3',
        type: song.mime,
        data: RNFetchBlob.wrap(song.path.replace('file://', ''))
      },
      { name: 'type', data: /video\//.test(song.mime) ? 'video' : 'audio' },
      { name: 'name', data: song.name }
    ]
    if (song.genres) {
      fields.push({ name: 'genres', data: JSON.stringify(song.genres) })
    }
    if (albumId) {
      const album = _.find(albums, { _id: albumId })
      fields.push({ name: 'album_id', data: albumId })
      fields.push({ name: 'band_id', data: album.band_id })
    }
    if (song.image) {
      fields.push({
        name: 'image',
        filename: song.image.filename || 'image.jpg',
        type: song.image.mime || 'image/jpeg',
        data: RNFetchBlob.wrap(song.image.path)
      })
    }
    const postResponse = await RNFetchBlob.fetch(
      'POST',
      `${config.BASE_URL}/api/posts/${id}/songs`,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      fields
    ).uploadProgress((written, total) => {
      console.log('uploaded', written / total)
    })
    __DEV__ && console.log('Upload song', postResponse)
  }

  async onPickImagePress () {
    try {
      const images = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        compressImageMaxWidth: 720,
        compressImageMaxHeight: 720,
        loadingLabelText: I18nJs.t('processingAssets')
      })
      this.setState({ images: [...this.state.images, ...images] })
    } catch (_) { }
  }

  async onOpenCameraPress () {
    try {
      const images = await ImagePicker.openCamera({
        multiple: true,
        compressImageMaxWidth: 720,
        compressImageMaxHeight: 720,
        loadingLabelText: I18nJs.t('processingAssets')
      })
      this.setState({ images: [...this.state.images, ...images] })
    } catch (_) { }
  }

  async onPickVideoPress () {
    try {
      const video = await ImagePicker.openPicker({
        mediaType: 'video',
        loadingLabelText: I18nJs.t('processingAssets')
      })
      video.image = await RNThumbnail.get(video.path)
      this.setState({ songs: [...this.state.songs, video] }, () => {
        this.dialogInput.show({ text: '', onSubmit: (name) => this.onEnterSongName(name, this.state.songs.length - 1) })
      })
    } catch (_) { }
  }

  async onPickAudioPress () {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.audio()]
    }, (error, res) => {
      __DEV__ && console.log(error)
      if (!error) {
        const song = {
          mediaType: 'audio',
          mime: res.mime || 'audio/mp3',
          filename: res.fileName,
          path: res.uri
        }

        this.setState({ songs: [...this.state.songs, song] }, () => {
          this.dialogInput.show({ text: '', onSubmit: (name) => this.onEnterSongName(name, this.state.songs.length - 1) })
        })
      }
    })
  }

  removeImage (index) {
    let { images } = this.state
    images.splice(index, 1)
    this.setState({ images })
  }

  onSelectGenres (genres, index) {
    let { songs } = this.state
    songs[index].genres = genres
    this.setState({ songs })
    this.dialogTag.dimiss()
  }

  onEnterSongName (name, index) {
    if (name) {
      let { songs } = this.state
      songs[index].name = name
      this.setState({ songs, nameError: '' })
      this.dialogInput.dimiss()
    } else {
      this.setState({ nameError: I18nJs.t('theNameIsRequired') })
    }
  }

  async onPlayVideo (playIndex) {
    const songs = this.state.songs.map((song, index) => {
      song.isPlaying = index === playIndex
      return song
    })
    this.setState({ songs })
  }

  async onStopVideo (index) {
    let songs = this.state.songs
    if (songs[index].isPlaying) {
      songs[index].isPlaying = false
    } else {
      songs.splice(index, 1)
    }
    this.setState({ songs })
  }

  onPlayAudio (playIndex) {
    const songs = this.state.songs.map((song, index) => {
      song.isPlaying = index === playIndex
      return song
    })
    console.log(playIndex, songs)
    this.setState({ songs })
  }

  renderSong ({ item, index }) {
    return /video\//.test(item.mime)
      ? this.renderVideo({ item, index })
      : this.renderAudio({ item, index })
  }

  renderVideo ({ item, index }) {
    return (
      <View>
        {!item.isPlaying
          ? (
            <View style={styles.videoPreview}>
              <Image
                style={styles.videoCover}
                source={{ uri: item.image.path }} />
              <View style={styles.videoContent}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => this.dialogInput.show({ text: item.name, onSubmit: (name) => this.onEnterSongName(name, index) })}>
                    <Text style={styles.videoTitle}>{item.name || I18nJs.t('enterSongName')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.dialogTag.show({
                    tags: item.genres || [],
                    onSubmit: (genres) => this.onSelectGenres(genres, index)
                  })}>
                    <Text style={styles.genreTags}>
                      {item.genres
                        ? item.genres.map(tag => `#${tag}`).join(' ')
                        : I18nJs.t('enterGenres')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <PlayIcon white onPress={() => this.onPlayVideo(index)} />
              </View>
            </View>
          )
          : (
            <View style={styles.videoPreview}>
              <VideoPlayer
                ref={ref => { this.videoPlayer = ref }}
                video={{ uri: item.path }}
                placeholder={item.image.path}
                style={styles.videoCover}
                autoplay
                onEnd={() => this.setState({ isPlaying: false })}
              />
            </View>
          )
        }
        <TouchableOpacity style={styles.closeButton} onPress={() => this.onStopVideo(index)}>
          <Image source={Images.closeButton} style={styles.closeButton} />
        </TouchableOpacity>
      </View>
    )
  }

  renderAudio ({ item, index }) {
    return (
      <View style={styles.row}>
        {item.isPlaying
          ? (
            <TouchableOpacity onPress={() => this.onPlayAudio(null)} style={{ padding: 10 }}>
              <DoubleBounce size={10} color={Colors.primary} />
              <Video
                source={{ uri: item.path }}
                paused={false}
                muted={false}
                onError={err => console.log(err)}
                onEnd={() => this.onPlayAudio(null)}
              />
            </TouchableOpacity>
          )
          : <PlayIcon onPress={() => this.onPlayAudio(index)} />
        }
        <View>
          <TouchableOpacity onPress={() => this.dialogInput.show({ text: item.name, onSubmit: (name) => this.onEnterSongName(name, index) })}>
            <Text style={styles.songTitle}>{item.name || I18nJs.t('enterSongName')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.dialogTag.show({
            tags: item.genres || [],
            onSubmit: (genres) => this.onSelectGenres(genres, index)
          })}>
            <Text style={styles.audioGenreTags}>
              {item.genres
                ? item.genres.map(tag => `#${tag}`).join(' ')
                : I18nJs.t('enterGenres')}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => this.onStopVideo(index)}>
          <Image source={Images.closeButton} style={styles.closeButton} />
        </TouchableOpacity>
      </View >
    )
  }

  renderImage ({ item, index }) {
    return (
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.path }} style={styles.image} />
        <View style={styles.imageCover} />
        <MaterialIcons
          name='close'
          size={20}
          color={Colors.primary}
          onPress={() => this.removeImage(index)}
          style={styles.removeImage}
        />
      </View>
    )
  }

  renderAlbum ({ item, index }) {
    const cover = item.cover ? { uri: url(item.cover) } : Images.logo
    return (
      <TouchableOpacity
        style={styles.addAlbumButton}
        onPress={() => this.state.albumId === item._id
          ? this.setState({ albumId: null })
          : this.setState({ albumId: item._id })
        }
      >
        <Image source={cover} style={styles.albumButtonBackground} />
        <View style={styles.albumOverlay} />
        <Text style={styles.albumText}>{item.name}</Text>
        {this.state.albumId === item._id && <Image source={Images.checked} style={styles.checkerAlbum} />}
      </TouchableOpacity>
    )
  }

  render () {
    const { songs, albums, images, text } = this.state
    const { user } = this.props.auth
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.containerContent}>
          <View style={styles.postInputs}>
            <Avatar source={user.avatar} size={35} />
            <AutoGrowingTextInput
              style={styles.input}
              underlineColorAndroid='transparent'
              multiline
              placeholder={I18nJs.t('writeSomething')}
              value={text}
              onChange={event => this.setState({ text: event.nativeEvent.text || '' })}
            />
          </View>

          {!!images.length && (
            <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderImage.bind(this)}
              extraData={this.state}
              horizontal
              style={styles.images}
            />
          )}

          <FlatList
            data={songs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderSong.bind(this)}
            extraData={this.state}
          />

          <View style={styles.bottomSection}>
            <View>
              {!!this.state.songs.length && (
                <View style={styles.albumsView}>
                  <View style={styles.albums}>
                    <TouchableOpacity style={styles.addAlbumButton} onPress={() => Actions.newAlbumScreen({ getAlbums: this.getAlbums.bind(this) })}>
                      <Image source={Images.iconPlusRed} style={styles.addButtonImage} />
                      <Text style={styles.addAlbumText}>{I18nJs.t('createAlbum')}</Text>
                    </TouchableOpacity>
                    <FlatList
                      data={albums}
                      keyExtractor={(item, index) => index}
                      renderItem={this.renderAlbum.bind(this)}
                      horizontal
                      extraData={this.state}
                    />
                  </View>
                </View>
              )}
              <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => this.ActionSheetMedia.show()}>
                  <Image source={Images.musicButton} style={styles.buttonImage} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.ActionSheet.show()}>
                  <Image source={Images.imageButton} style={styles.buttonImage} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={Images.locationButton} style={styles.buttonImage} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <ActionSheet
          ref={ref => (this.ActionSheet = ref)}
          title={I18nJs.t('uploadImage')}
          options={[I18nJs.t('openCamera'), I18nJs.t('openGallery'), I18nJs.t('cancel')]}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => {
            index === 0 && this.onOpenCameraPress()
            index === 1 && this.onPickImagePress()
          }}
        />
        <ActionSheet
          ref={ref => (this.ActionSheetMedia = ref)}
          title={I18nJs.t('selectYourSong')}
          options={[I18nJs.t('audio'), I18nJs.t('video'), I18nJs.t('cancel')]}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={(index) => {
            index === 0 && this.onPickAudioPress()
            index === 1 && this.onPickVideoPress()
          }}
        />
        <DialogInput
          ref={ref => { this.dialogInput = ref }}
          placeholder={I18nJs.t('enterSongName')}
          error={this.state.nameError}
        />
        <DialogTag
          ref={ref => { this.dialogTag = ref }}
          placeholder={I18nJs.t('enterGenres')}
        />
      </KeyboardAwareScrollView>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPostScreen)
