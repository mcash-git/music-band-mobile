import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image, TextInput } from 'react-native'
import styles from './Styles/CommentInputStyle'
import ExamplesRegistry from '../Services/ExamplesRegistry'
import { Colors } from '../Themes'

// Note that this file (App/Components/CommentInput) needs to be
// imported in your app somewhere, otherwise your component won't be
// compiled and added to the examples dev screen.

// Ignore in coverage report
/* istanbul ignore next */
ExamplesRegistry.addComponentExample('Comment Input', () =>
  <CommentInput
    text='real buttons have curves'
    onPress={() => window.alert('Rounded Button Pressed!')}
  />
)

export default class CommentInput extends Component {
  static propTypes = {
    onChangeText: PropTypes.func,
    value: PropTypes.string,
    error: PropTypes.string
  }

  focus () {
    this.refs.input.focus()
  }

  render () {
    return (
      <View style={[styles.inputContainer, this.props.style]}>
        <View style={styles.inputWrap}>
          {this.props.icon && <Image source={this.props.icon} style={styles.icon} />}
          <TextInput
            ref='input'
            style={styles.inputText}
            onChangeText={this.props.onChangeText}
            value={this.props.value}
            placeholder={this.props.placeholder}
            secureTextEntry={this.props.secureTextEntry}
            keyboardType={this.props.keyboardType}
            onSubmitEditing={this.props.onSubmitEditing}
            autoCapitalize={this.props.autoCapitalize}
            autoCorrect={this.props.autoCorrect}
            placeholderTextColor={Colors.steel}
            underlineColorAndroid={Colors.transparent}
          />
          {this.props.renderRight && this.props.renderRight()}
        </View>
        {this.props.error && <Text style={styles.error}>{this.props.error}</Text>}
      </View>
    )
  }
}
