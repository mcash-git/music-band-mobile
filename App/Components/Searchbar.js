import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, TextInput, Image } from 'react-native'
import styles from './Styles/SearchbarStyle'
import { Images, Colors } from '../Themes'

export default class Searchbar extends Component {
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
      <View style={styles.searchBlock}>
        <Image source={Images.iconMagnifier} style={styles.icon} />
        <TextInput
          {...this.props}
          underlineColorAndroid={Colors.transparent}
          style={styles.input}
          returnKeyType={'search'}
        />
      </View>
    )
  }
}
