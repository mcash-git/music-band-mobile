import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { TouchableOpacity, Image } from 'react-native'
import styles from './Styles/PlayIconStyle'
import { Images } from '../Themes'

export default class PlayIcon extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render () {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={[styles.container, this.props.style]}>
        <Image source={this.props.white ? Images.iconPlayWhite : Images.iconPlay} style={styles.playIcon} />
      </TouchableOpacity>
    )
  }
}
