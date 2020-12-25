import React, { Component } from 'react'
import { ScrollView, Text, View, FlatList, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SearchScreenStyle'
import Avatar from '../Components/Avatar'
import I18nJs from 'react-native-i18n'
import { Images, Colors } from '../Themes'
import { Actions } from 'react-native-router-flux'
// import _ from 'lodash'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import { url } from '../Lib/Utils'
import _ from 'lodash'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Loading from 'react-native-loader-overlay'
import { ConfirmDialog } from 'react-native-simple-dialogs'
import ActionSheet from 'react-native-actionsheet'

const api = Api.create()

class SearchScreen extends Component {
  constructor (props) {
    super(props)
    let instrumentUrls = {}
    for (const instrument of props.instruments) {
      instrumentUrls[instrument._id] = url(instrument.image)
    }
    this.state = {
      suggestedUsers: [],
      instrumentUrls,

      province: '',
      district: '',
      selectedInstruments: [],
      search: '',
      myBands: []
    }
  }

  componentWillMount () {
    this.getSuggestedUsers()
  }

  async getSuggestedUsers () {
    const { token, user } = this.props.auth
    api.setToken(token)

    const query = {
      sort: '-folower_count',
      where: {
        _id: { $ne: user._id }
      }
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

    const response = await api.getSuggestedUsers(user._id, query, this.state.search)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get suggested response', response)
    if (response.ok) {
      this.setState({ suggestedUsers: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async onInvitePress (user) {
    this.setState({ user })
    await this.getMyBands()
  }

  async getMyBands () {
    this.setState({ isGetData: true })
    const { token, user } = this.props.auth
    api.setToken(token)

    const response = await api.getUserBands(user._id, { with: ['users'] })
    this.setState({ isGetData: false })
    __DEV__ && console.log('get myBands response', response)
    if (response.ok) {
      this.setState({ myBands: response.data.data }, () => {
        this.ActionSheetInvite.show()
      })
    } else {
      showError(response.data)
    }
  }

  async onInvite (band) {
    const { user } = this.state
    const { token } = this.props.auth
    if (_.find(band.users, { _id: user._id })) {
      this.setState({ alertVisible: true, message: I18nJs.t('userJoined') })
      return false
    }

    api.setToken(token)
    this.loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    const response = await api.inviteUser(band._id, { user_id: user._id })
    __DEV__ && console.log('Send invite response', response)
    Loading.hide(this.loader)
    if (response.ok) {
      this.setState({ alertVisible: true, message: I18nJs.t('inviteSuccess') })
    } else {
      showError(response.data)
    }
  }

  async onSearch (searchData) {
    this.setState(searchData, () => this.getSuggestedUsers())
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
    }, () => this.getSuggestedUsers())
  }

  renderArtists ({ item }) {
    return (
      <TouchableOpacity style={styles.artist} onPress={() => Actions.profileScreen({ user: item })}>
        <Avatar source={item.avatar} size={70} />
        <Text style={[styles.artistName, { marginTop: 5, marginHorizontal: 5 }]} numberOfLines={1}>{item.name}</Text>
        <TouchableOpacity style={styles.inviteButton} onPress={() => this.onInvitePress(item)}>
          <Image source={Images.iconPlusWhite} style={styles.iconTiny} />
          <Text style={styles.inviteText}>{I18nJs.t('invite')}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  renderSearchArtists ({ item }) {
    return (
      <TouchableOpacity style={styles.row} onPress={() => Actions.profileScreen({ user: item })}>
        <Avatar source={item.avatar} size={40} />
        <View style={styles.rowMiddle}>
          <Text style={styles.artistName}>{item.name}</Text>
          <Text style={styles.artistAddress}>{item.district}, {item.province}</Text>
          <View style={styles.interests}>
            {item.instrument_ids.map((instrumentId, index) => (
              <View style={styles.interest} key={index.toString()}>
                <Image source={{ uri: this.state.instrumentUrls[instrumentId] }} style={styles.iconTiny} />
              </View>
            ))}
          </View>
        </View>
        <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconSmall} />
      </TouchableOpacity>
    )
  }

  render () {
    const { suggestedUsers } = this.state
    const search = this.getSearchText()
    return (
      <View style={styles.container}>
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
        {!!search && !this.state.suggestedUsers.length
          ? <Text style={styles.title}>{I18nJs.t('noArtistFound')}</Text>
          : (
            <View>
              <Text style={styles.title}>{I18nJs.t('suggestedArtists')}</Text>
              <FlatList
                data={_.take(suggestedUsers, 5)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderArtists.bind(this)}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
              {suggestedUsers.length > 5 && <Text style={styles.title}>{I18nJs.t('seeMore')}</Text>}
              <FlatList
                data={_.takeRight(suggestedUsers, suggestedUsers.length - 5)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderSearchArtists.bind(this)}
              />
            </View>
          )}

        <ActionSheet
          ref={ref => (this.ActionSheetInvite = ref)}
          title={I18nJs.t('selectYourBand')}
          options={[I18nJs.t('cancel'), ..._.map(this.state.myBands, 'name')]}
          cancelButtonIndex={0}
          onPress={(index) => {
            index && this.onInvite(this.state.myBands[index - 1])
          }}
        />

        <ConfirmDialog
          visible={this.state.alertVisible}
          title={this.state.message}
          onTouchOutside={() => this.setState({ alertVisible: false })}
          positiveButton={{
            title: I18nJs.t('ok'),
            onPress: () => this.setState({ alertVisible: false })
          }}
        />
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)
