import React, { Component } from 'react'
import { ScrollView, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SearchFilterScreenStyle'
import Searchbar from '../Components/Searchbar'
import I18nJs from 'react-native-i18n'
import { Images } from '../Themes'
import ModalFilterPicker from 'react-native-modal-filter-picker'
import CheckBox from 'react-native-checkbox'
import Districts from '../Services/Districts'
import _ from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Actions } from 'react-native-router-flux'

class SearchFilterScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showProvincePicker: false,
      showDistrictPicker: false,
      province: props.province,
      district: props.district,
      selectedInstruments: props.selectedInstruments || [],
      search: props.search
    }
  }

  componentWillMount () {
    Actions.refresh({
      right: () => (
        <TouchableOpacity onPress={this.onSave.bind(this)} style={styles.navButton}>
          <Text style={styles.rightButtonText}>{I18nJs.t('done')}</Text>
        </TouchableOpacity>
      )
    })
  }

  onCheckItem (id) {
    let selectedInstruments = this.state.selectedInstruments
    if (selectedInstruments.includes(id)) {
      selectedInstruments = selectedInstruments.filter(item => item !== id)
    } else {
      selectedInstruments.push(id)
    }
    this.setState({ selectedInstruments })
  }

  onSave () {
    Actions.pop()
    this.props.onSearch && this.props.onSearch(this.state)
  }

  renderItem ({ item }) {
    const instrument = item
    return (
      <View>
        <View style={styles.row}>
          {/* <Image style={styles.instrumentImage} source={{ uri: `${config.BASE_URL}/${instrument.image}` }} /> */}
          <Text style={styles.instrumentName}>{instrument.name}</Text>
          <CheckBox
            label=''
            checked={this.state.selectedInstruments.includes(item._id)}
            onChange={(checked) => this.onCheckItem(item._id)}
            checkedImage={Images.checked}
            uncheckedImage={Images.uncheck}
          />
        </View>
      </View>
    )
  }

  render () {
    const { instruments } = this.props
    const provinces = _(Districts)
      .map('province')
      .uniq()
      .map(item => { return { key: item, label: item } })
      .unshift({ key: '', label: '----' })
      .value()
    const districts = _(Districts)
      .filter({ province: this.state.province })
      .map('district')
      .map(item => { return { key: item, label: item } })
      .unshift({ key: '', label: '----' })
      .value()
    return (
      <View style={styles.container}>
        <View style={styles.searchBlock}>
          <Searchbar
            placeholder={I18nJs.t('search')}
            value={this.state.search}
            onChangeText={search => this.setState({ search })}
            onSubmitEditing={() => this.onSave()}
            autoFocus
          />
        </View>
        <KeyboardAwareScrollView>
          <Text style={styles.title}>{I18nJs.t('location')}</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => this.setState({ showProvincePicker: true })}>
            <Text style={styles.rowLabel}>{I18nJs.t('province')}</Text>
            {this.state.province
              ? <Text style={styles.rowValue}>{this.state.province}</Text>
              : <Text style={styles.placeholder}>{I18nJs.t('selectProvince')}</Text>
            }
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => this.setState({ showDistrictPicker: true })}>
            <Text style={styles.rowLabel}>{I18nJs.t('district')}</Text>
            {this.state.district
              ? <Text style={styles.rowValue}>{this.state.district}</Text>
              : <Text style={styles.placeholder}>{I18nJs.t('selectDistrict')}</Text>
            }
            <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
          </TouchableOpacity>
          <Text style={styles.title}>{I18nJs.t('instrument')}</Text>
          <FlatList
            data={instruments}
            extraData={this.state}
            keyExtractor={item => item._id}
            renderItem={this.renderItem.bind(this)}
          />
        </KeyboardAwareScrollView>
        <ModalFilterPicker
          visible={this.state.showProvincePicker}
          onSelect={(value) => this.setState({ province: value, district: '', showProvincePicker: false })}
          onCancel={() => this.setState({ showProvincePicker: false })}
          androidUnderlineColor='transparent'
          options={provinces}
          optionTextStyle={styles.pickerText}
        />
        <ModalFilterPicker
          visible={this.state.showDistrictPicker}
          onSelect={(value) => this.setState({ district: value, showDistrictPicker: false })}
          onCancel={() => this.setState({ showDistrictPicker: false })}
          androidUnderlineColor='transparent'
          options={districts}
          optionTextStyle={styles.pickerText}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    instruments: state.instrument.instruments
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilterScreen)
