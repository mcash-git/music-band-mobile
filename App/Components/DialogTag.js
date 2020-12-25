import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/DialogTagStyle'
import Modal from 'react-native-modal'
import I18nJs from 'react-native-i18n'
import TagInput from 'react-native-tag-input'
import { Colors } from '../Themes'

export default class DialogTag extends Component {
  state = {
    isVisible: false,
    text: '',
    tags: []
  }

  show ({ tags, onSubmit }) {
    this.setState({ tags, onSubmit, isVisible: true })
  }

  dimiss () {
    this.setState({ isVisible: false })
  }

  onSubmit () {
    return this.state.onSubmit
      ? this.state.onSubmit(this.state.tags)
      : this.props.onSubmit(this.state.tags)
  }

  onChangeTags = (tags) => {
    this.setState({ tags })
  }

  onChangeText = (text) => {
    this.setState({ text })
    const lastTyped = text.charAt(text.length - 1)
    const parseWhen = [',', ' ', ';', '\n']
    if (parseWhen.indexOf(lastTyped) > -1) {
      this.setState({
        tags: [...this.state.tags, this.state.text],
        text: ''
      })
    }
  }

  render () {
    const inputProps = {
      keyboardType: 'default',
      placeholder: this.props.placeholder,
      autoFocus: true,
      underlineColorAndroid: 'transparent',
      style: styles.input,
      onKeyPress: event => null
    }
    return (
      <Modal
        isVisible={this.state.isVisible}
      >
        <View style={styles.container}>
          <View style={styles.modalContent}>
            <TagInput
              scrollViewProps={{ style: { flex: 1, marginHorizontal: 10 } }}
              tagContainerStyle={{ height: 25, paddingVertical: 0 }}
              tagTextStyle={styles.tagStyle}
              value={this.state.tags}
              onChange={this.onChangeTags}
              labelExtractor={(tag) => tag}
              text={this.state.text}
              onChangeText={this.onChangeText}
              tagColor={Colors.lightGrey}
              tagTextColor={Colors.primary}
              inputProps={inputProps}
              maxHeight={75}
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
