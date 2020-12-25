import React, { Component } from 'react'
import { View, Text, RefreshControl, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SearchUserScreenStyle'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import I18nJs from 'react-native-i18n'
import Searchbar from '../Components/Searchbar'
import Avatar from '../Components/Avatar'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import { Actions } from 'react-native-router-flux'
import { Images, Colors } from '../Themes'
import { url } from '../Lib/Utils'

const api = Api.create()

class SearchUserScreen extends Component {
  constructor (props) {
    super(props)
    let instrumentUrls = {}
    for (const instrument of props.instruments) {
      instrumentUrls[instrument._id] = url(instrument.image)
    }
    this.state = {
      search: '',
      users: [],
      instrumentUrls,
      isSearching: false
    }
  }

  onChangeText (search) {
    const searchTime = new Date()
    this.setState({ search, searchTime, isSearching: true })
    setTimeout(() => {
      if (this.state.searchTime === searchTime) {
        if (search.length > 2) {
          this.onSearch()
        } else {
          this.setState({ users: [], isSearching: false })
        }
      }
    }, 1000)
  }

  async onSearch () {
    const { token, user } = this.props.auth
    api.setToken(token)
    const query = { where: { _id: { $ne: user._id } } }
    const response = await api.searchUsers(query, this.state.search)
    this.setState({ isSearching: false })
    __DEV__ && console.log('get users response', response)
    if (response.ok) {
      this.setState({ users: response.data.data })
    } else {
      showError(response.data)
    }
  }

  onPickUser (user) {
    Actions.pop()
    this.props.onPickUser && this.props.onPickUser(user)
  }

  renderUser ({ item }) {
    return (
      <TouchableOpacity style={styles.row} onPress={() => this.onPickUser(item)}>
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
    return (
      <View style={styles.container}>
        <View style={styles.searchBlock}>
          <Searchbar
            onChangeText={(search) => this.onChangeText(search)}
            value={this.state.search}
            placeholder={I18nJs.t('search')}
            autoFocus
          />
        </View>
        <KeyboardAwareFlatList
          data={this.state.users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderUser.bind(this)}
          keyboardShouldPersistTaps='handled'
          refreshing={this.state.isSearching}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isSearching}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchUserScreen)
