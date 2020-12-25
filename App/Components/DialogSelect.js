import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import styles from './Styles/DialogSelectStyle'
import { Colors, Images } from '../Themes'
import Modal from 'react-native-modal'
import CheckBox from 'react-native-checkbox'
import I18nJs from 'react-native-i18n'

export default class DialogSelect extends Component {
  state = {
    selectedItems: [],
    items: []
  }

  show ({ items = [], selectedItems = [], onSubmit }) {
    this.setState({ items, selectedItems, onSubmit, isVisible: true })
  }

  dimiss () {
    this.setState({ isVisible: false })
  }

  onSubmit () {
    return this.state.onSubmit
      ? this.state.onSubmit(this.state.selectedItems)
      : this.props.onSubmit(this.state.selectedItems)
  }

  onCheckItem (selectedItem) {
    if (this.props.multiple) {
      if (!this.state.selectedItems.includes(selectedItem)) {
        this.setState({ selectedItems: this.state.selectedItems.concat(selectedItem) })
      } else {
        this.setState({ selectedItems: this.state.selectedItems.filter(item => item !== selectedItem) })
      }
    } else {
      this.setState({ selectedItems: [selectedItem] })
    }
  }

  renderItem ({ item }) {
    return (
      <View style={styles.item}>
        <TouchableOpacity style={styles.row} onPress={() => this.onCheckItem(item._id)}>
          <Text style={styles.itemName}>{item.name}</Text>
          <CheckBox
            label=''
            checked={this.state.selectedItems.includes(item._id)}
            onChange={(checked) => this.onCheckItem(item._id)}
            checkedImage={Images.checked}
            uncheckedImage={Images.uncheck}
          />
        </TouchableOpacity>
        <View style={styles.hr} />
      </View>
    )
  }

  render () {
    return (
      <Modal
        isVisible={this.state.isVisible}
      >
        <View style={styles.container}>
          <View style={styles.modalContent}>
            <FlatList
              style={[styles.list, { maxHeight: 50 * this.state.items.length }]}
              data={this.state.items}
              extraData={this.state}
              keyExtractor={item => item._id}
              renderItem={this.renderItem.bind(this)}
            />
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
