import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native'
import styles from './Styles/BottomButtonStyle'
import { Colors } from '../Themes'

export default class BottomButton extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // Defaults for props
  static defaultProps = {
    backgroundColor: Colors.snow
  }

  render () {
    return (
      <TouchableOpacity style={[styles.container, { backgroundColor: this.props.backgroundColor }]} onPress={this.props.onPress}>
        <Text style={[styles.text, { color: this.props.textColor }]}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }
}
