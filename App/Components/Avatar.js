import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Image } from 'react-native'
// import styles from './Styles/AvatarStyle'
import { Images } from '../Themes'
import ImageLoad from 'react-native-image-placeholder'
import { url } from '../Lib/Utils'

export default class Avatar extends Component {
  // Prop type warnings
  static propTypes = {
    size: PropTypes.number,
    source: PropTypes.string
  }

  // Defaults for props
  static defaultProps = {
    size: 50
  }

  render () {
    const { source, size } = this.props
    const styles = StyleSheet.create({
      avatar: {
        width: size,
        height: size
      },
      placeholderStyle: {
        width: size,
        height: size,
        borderRadius: size / 2
      }
    })
    return source
      ? <ImageLoad
        isShowActivity={false}
        source={{ uri: url(source) }}
        placeholderSource={Images.noavatar}
        style={styles.avatar}
        placeholderStyle={styles.placeholderStyle}
        customImagePlaceholderDefaultStyle={styles.placeholderStyle}
        borderRadius={this.props.size / 2}
      />
      : <Image
        source={Images.noavatar}
        style={styles.avatar}
        resizeMode='cover'
        borderRadius={this.props.size / 2}
      />
  }
}
