import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/BandsScreenStyle'
import I18nJs from 'react-native-i18n'
import { Images, Colors } from '../Themes'
import ImageLoad from 'react-native-image-placeholder'
import { Actions } from 'react-native-router-flux'
import SafeAreaView from 'react-native-safe-area-view'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import { url } from '../Lib/Utils'
import Genres from '../Services/Genres'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'

const api = Api.create()

class BandsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bands: [],

      province: '',
      district: '',
      selectedInstruments: [],
      search: ''
    }
  }

  componentWillMount () {
    this.getBands()
  }

  componentWillReceiveProps (nextProps) {
    if (!!this.props.enterTime && this.props.enterTime != nextProps.enterTime) {
      this.getBands()
    }
    this.forceUpdate()
  }

  async getBands (isRefreshing) {
    this.setState({ isGetData: true })
    const { token } = this.props.auth
    api.setToken(token)

    const query = {
      sort: '-follower_count',
      limit: 20,
      where: {}
    }

    if (this.state.province) {
      query.where.province = this.state.province
    }

    if (this.state.district) {
      query.where.district = this.state.district
    }

    if (this.state.selectedInstruments.length) {
      query.where.$or = []
      for (let selectedInstrument of this.state.selectedInstruments) {
        query.where.$or.push({ instrument_ids: selectedInstrument })
      }
    }

    const response = await api.getBands(query, this.state.search)
    this.setState({ isGetData: false })
    __DEV__ && console.log('getBands response', response)
    if (response.ok) {
      this.setState({ bands: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async onSearch (searchData) {
    this.setState(searchData, () => this.getBands())
  }

  getSearchText () {
    let text = this.state.search
    if (this.state.province) {
      text = `${text} [${I18nJs.t('province')}:${this.state.province}]`
    }
    if (this.state.district) {
      text = `${text} [${I18nJs.t('district')}:${this.state.district}]`
    }

    const selectedInstruments = _.filter(this.props.instruments, instrument => this.state.selectedInstruments.includes(instrument._id))
    if (selectedInstruments.length) {
      const names = _.map(selectedInstruments, 'name').join(',')
      text = `${text} [${I18nJs.t('instruments')}:${names}]`
    }

    return text.trim()
  }

  resetSearch () {
    this.setState({
      province: '',
      district: '',
      selectedInstruments: [],
      search: ''
    }, () => this.getBands())
  }

  renderHeader () {
    const search = this.getSearchText()
    return (
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{I18nJs.t('bands')}</Text>
          <TouchableOpacity style={{ marginLeft: 5 }} onPress={Actions.bandCreateScreen}>
            <Image source={Images.iconPlus} style={styles.iconSmall} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBlock}>
          <TouchableOpacity
            style={styles.fakeSearchBar}
            onPress={() => Actions.searchFilterScreen({
              search: this.state.search,
              selectedInstruments: this.state.selectedInstruments,
              province: this.state.province,
              district: this.state.district,
              onSearch: (searchData) => this.onSearch(searchData)
            })}
          >
            <Image source={Images.iconMagnifier} style={styles.iconTiny} />
            <Text style={styles.input}>{search || I18nJs.t('search')}</Text>
            {!!search && (
              <TouchableOpacity onPress={() => this.resetSearch()} style={{ paddingHorizontal: 5 }}>
                <MaterialCommunityIcons name='filter-remove-outline' size={15} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderItem ({ item }) {
    return (
      <TouchableOpacity style={styles.band} onPress={() => Actions.bandDetailScreen({ band: item })}>
        <ImageLoad
          style={styles.cover}
          placeholderStyle={styles.cover}
          loadingStyle={{ size: 'small', color: Colors.windowTint }}
          source={{ uri: url(item.cover) }} />
        <View style={styles.overlay} />
        <Text style={styles.bandName} numberOfLines={1}>{item.name}</Text>
        {/* <View style={{ flexDirection: 'row' }}>
          <Image source={Images.iconStar} style={styles.iconTiny} />
          <Text style={styles.rate}>4.5</Text>
        </View> */}
        <View style={styles.tags}>
          {item.genres.map((genre, index) => (
            <View style={styles.tag} key={index.toString()}>
              <Text style={styles.tagText}>#{genre}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    const { bands } = this.state
    const search = this.getSearchText()
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          {this.renderHeader()}
          {!!search && !this.state.bands.length
            ? <Text style={styles.title}>{I18nJs.t('noBandFound')}</Text>
            : (
              <View style={styles.main}>
                <FlatList
                  data={bands}
                  extraData={this.state}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={this.renderItem.bind(this)}
                  horizontal
                  style={styles.bands}
                />
                <Text style={styles.title}>{I18nJs.t('topGenres')}</Text>
                <FlatList
                  data={Genres}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.row} onPress={() => Actions.topGenresScreen({ genre: item })}>
                      <Text style={styles.rowLabel}>{item}</Text>
                      <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={<Text style={styles.empty}>{I18nJs.t('noBandBaseOnYouLocation')}</Text>}
                />
              </View>
            )}
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    instruments: state.instrument.instruments
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BandsScreen)
