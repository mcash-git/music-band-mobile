import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

import I18nJs from 'react-native-i18n'
import { Images, Colors } from '../Themes'
import PlayIcon from '../Components/PlayIcon'
import ImageLoad from 'react-native-image-placeholder'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
import PhotoGrid from 'react-native-thumbnail-grid'
import RNShineButton from 'react-native-shine-button'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import { url } from '../Lib/Utils'
import Avatar from '../Components/Avatar'
import SquareImage from '../Components/SquareImage'
import moment from 'moment'
import styles from './Styles/PostViewStyle'

const api = Api.create()

class PostView extends Component {
  // Prop type warnings
  static propTypes = {
    showProfileOnPress: PropTypes.bool
  }

  // Defaults for props
  static defaultProps = {
    showProfileOnPress: true
  }

  async onLike (item, like) {
    const { token } = this.props.auth
    api.setToken(token)
    const response = await api.likePost(item._id, like)
    __DEV__ && console.log('Like response', response)
    if (response.ok) {
      this.props.onLiked && this.props.onLiked(item, like)
    } else {
      showError(response.data)
    }
  }

  render () {
    const { item } = this.props
    const { user } = item
    return (
      <View style={styles.article}>
        <TouchableOpacity onPress={() => this.props.showProfileOnPress && Actions.profileScreen({ user })} style={styles.articleHeader}>
          <Avatar source={user.avatar} size={40} />
          <View style={{ marginHorizontal: 10 }}>
            <Text style={styles.bandName}>{user.name}</Text>
            <Text style={styles.lastUpdateText}>{moment.utc(item.created_at).fromNow()}</Text>
          </View>
        </TouchableOpacity>
        {!!item.text && <Text style={styles.articleContent}>{item.text}</Text>}
        {!!item.images && <PhotoGrid source={_.map(_.map(item.images, 'file'), url)} onPressImage={(event, source) => this.showImage(source, item.images)} />}
        {!!item.songs && item.songs.map(song => this.renderMedia(song, item))}
        {this.renderPostStatus(item)}
      </View>
    )
  }

  renderPostStatus (item) {
    return (
      <View style={styles.postStatus}>
        <Image source={Images.iconEye} style={[styles.iconTiny, { marginRight: 5 }]} />
        <Text style={[styles.lastUpdateText, { flex: 1 }]}>{item.view_count || 0} {I18nJs.t('views')}</Text>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => Actions.postCommentScreen({ post: item })}>
          <Image source={Images.iconComment} style={styles.iconTiny} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Image source={Images.iconUpload} style={styles.iconTiny} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => this.onLike(item, !item.is_liked)}>
          <RNShineButton
            shape={'heart'}
            color={Colors.lightGrey}
            fillColor={Colors.primary}
            size={20}
            value={item.is_liked}
            onChange={(value) => this.onLike(item, value)}
          />
        </TouchableOpacity>
      </View>
    )
  }

  showImage (source, images) {
    const imageIndex = _.findIndex(images, image => url(image.filePath) === source)
    Actions.photoScreen({ imageIndex, images })
  }

  renderMedia (song, post) {
    if (song.type === 'video') return this.renderVideo(song, post)
    if (song.type === 'audio') return this.renderAudio(song, post)
    if (song.type === 'album') return this.renderAlbum(song, post)
  }

  renderVideo (song, post) {
    return (
      <View key={song._id}>
        <TouchableOpacity style={styles.videoPreview} onPress={() => Actions.videoScreen({ song, post })}>
          <ImageLoad
            style={styles.videoCover}
            loadingStyle={{ size: 'small', color: Colors.windowTint }}
            placeholderStyle={styles.videoCover}
            // placeholderSource={Images.logo}
            source={{ uri: url(song.image) }} />
          <View style={styles.videoContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.videoTitle}>{song.name}</Text>
              <Text style={styles.instrumentTags}>{song.genres && song.genres.map(genre => `#${genre}`).join(' ')}</Text>
            </View>
            <PlayIcon white onPress={() => Actions.videoScreen({ song, post })} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderAudio (song, post) {
    return (
      <View key={song._id}>
        <TouchableOpacity style={styles.row} onPress={() => Actions.playerScreen({ song, post })}>
          <SquareImage source={song.album ? song.album.cover : null} size={40} />
          <View style={styles.songContent}>
            <Text style={styles.bandName}>{song.name}</Text>
            <Text style={styles.lastUpdateText}>{song.album ? song.album.name : I18nJs.t('noAlbum')}</Text>
          </View>
          <PlayIcon onPress={() => Actions.playerScreen({ song, post })} />
        </TouchableOpacity>
        <View style={styles.hr} />
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostView)
