import React, { Component } from 'react'
import { ScrollView, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/TopGenresScreenStyle'
import I18nJs from 'react-native-i18n'
import { Images, Colors } from '../Themes'
import ImageLoad from 'react-native-image-placeholder'
import { Actions } from 'react-native-router-flux'
import SafeAreaView from 'react-native-safe-area-view'
import { showError } from '../Lib/MessageBar'
import Api from '../Services/Api'
import { url } from '../Lib/Utils'
import SquareImage from '../Components/SquareImage'

const api = Api.create()

class TopGenresScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bands: []
    }
  }

  componentWillMount () {
    this.getBands()
    this.getLocationBands()
  }

  async getBands (isRefreshing) {
    this.setState({ isGetData: true })
    const { token, user } = this.props.auth
    api.setToken(token)

    const query = {
      where: {
        // genres: this.props.genre
      },
      sort: '-follower_count',
      limit: 20
    }

    const response = await api.getBands(query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('getBands response', response)
    if (response.ok) {
      this.setState({ bands: response.data.data })
    } else {
      showError(response.data)
    }
  }

  async getLocationBands (isRefreshing) {
    this.setState({ isGetData: true })
    const { token, user } = this.props.auth
    api.setToken(token)

    const query = {
      where: {
        // genres: this.props.genre,
        // province: user.province
      },
      sort: '-follower_count',
      limit: 20
    }

    const response = await api.getBands(query)
    this.setState({ isGetData: false })
    __DEV__ && console.log('get location Bands response', response)
    if (response.ok) {
      this.setState({ locationBands: response.data.data })
    } else {
      showError(response.data)
    }
  }

  renderHeader () {
    return (
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{this.props.genre}</Text>
          {/* <TouchableOpacity style={{ marginLeft: 5 }} onPress={Actions.bandCreateScreen}>
            <Image source={Images.iconPlus} style={styles.iconSmall} />
          </TouchableOpacity> */}
        </View>
        {/* <View style={styles.searchBlock}>
          <TouchableOpacity style={styles.fakeSearchBar} onPress={Actions.searchFilterScreen}>
            <Image source={Images.iconMagnifier} style={styles.iconTiny} />
            <Text style={styles.input}>{I18nJs.t('search')}</Text>
          </TouchableOpacity>
        </View> */}
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
    const { bands, locationBands } = this.state
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          {this.renderHeader()}

          <ScrollView style={styles.main}>
            <FlatList
              data={bands}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem.bind(this)}
              horizontal
              style={styles.bands}
            />

            <Text style={styles.title}>{I18nJs.t('baseOnYourLocation')}</Text>
            <FlatList
              data={locationBands}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.row} onPress={() => Actions.bandDetailScreen({ band: item })}>
                  <SquareImage source={item.cover} size={40} />
                  <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <Text style={styles.rowLabel}>{item.name}</Text>
                    <Text style={styles.address}>{item.district}, {item.province}</Text>
                  </View>
                  <Image source={Images.arrowRight} resizeMode='contain' style={styles.iconTiny} />
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopGenresScreen)
