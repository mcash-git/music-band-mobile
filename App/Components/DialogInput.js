import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import styles from './Styles/DialogInputStyle'
import Modal from 'react-native-modal'
import { Metrics } from '../Themes'
import I18nJs from 'react-native-i18n'

export default class DialogInput extends Component {
  state = {
    isVisible: false,
    text: ''
  }

  show ({ text, onSubmit }) {
    this.setState({ text, onSubmit, isVisible: true })
  }

  dimiss () {
    this.setState({ isVisible: false })
  }

  onSubmit () {
    return this.state.onSubmit
      ? this.state.onSubmit(this.state.text)
      : this.props.onSubmit(this.state.text)
  }

  render () {
    return (
      <Modal
        isVisible={this.state.isVisible}
      >
        <View style={styles.container}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.onSubmit.bind(this)}
              value={this.state.text}
              onChangeText={text => this.setState({ text })}
              autoFocus
              {...this.props}
            />
            <Text style={styles.error}>{this.props.error}</Text>
            <View style={styles.bottomModal}>
              <TouchableOpacity onPress={this.dimiss.bind(this)} style={styles.button}>
                <Text style={styles.buttonText}>{I18nJs.t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onSubmit.bind(this)} style={styles.button}>
                <Text style={styles.buttonText}>{I18nJs.t('ok')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}
