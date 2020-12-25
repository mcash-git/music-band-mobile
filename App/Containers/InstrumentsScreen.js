import React, { Component } from 'react'
import { ScrollView, Text, View, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/InstrumentsScreenStyle'
import I18n from 'react-native-i18n'
import CheckBox from 'react-native-checkbox'
import { Images, Colors } from '../Themes'
import BottomButton from '../Components/BottomButton'
import Api from '../Services/Api'
import Loading from 'react-native-loader-overlay'

import { bindActionCreators } from 'redux'
import AuthActions from '../Redux/AuthRedux'
import { Actions, ActionConst } from 'react-native-router-flux'
import { showError } from '../Lib/MessageBar'

const api = Api.create()

class InstrumentsScreen extends Component {
  state = {
    instrumentIds: []
  }

  onDonePress () {
    if (this.state.instrumentIds.length) {
      this.onUpdateUser()
    } else {
      showError({ message: I18n.t('mustSelectInstrument') })
    }
  }

  async onUpdateUser () {
    const { instrumentIds } = this.state
    const user = this.props.auth.user
    const loader = Loading.show({ size: 15, backgroundColor: Colors.cloud })
    api.setToken(this.props.auth.token)
    const response = await api.updateUser(user._id, { instrument_ids: instrumentIds })
    __DEV__ && console.log('Update user response', response)
    Loading.hide(loader)
    if (response.ok) {
      const user = response.data.data
      this.props.setAuth({ user })
      Actions.lightbox({ type: ActionConst.RESET })
    } else {
      showError(response.data)
    }
  }

  onCheckItem (id) {
    let instrumentIds = this.state.instrumentIds
    if (instrumentIds.includes(id)) {
      instrumentIds = instrumentIds.filter(item => item !== id)
    } else {
      instrumentIds.push(id)
    }
    this.setState({ instrumentIds })
  }

  renderItem ({ item }) {
    const instrument = item
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.instrumentName}>{instrument.name}</Text>
          <CheckBox
            label=''
            checked={this.state.instrumentIds.includes(item._id)}
            onChange={(checked) => this.onCheckItem(item._id)}
            checkedImage={Images.checked}
            uncheckedImage={Images.uncheck}
          />
        </View>
        <View style={styles.hr} />
      </View>
    )
  }

  render () {
    const { instruments } = this.props

    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <Text style={styles.title}>{I18n.t('selectYourFavoriteInstruments')}</Text>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.mainContainer}>
            <FlatList
              data={instruments}
              extraData={this.state}
              keyExtractor={item => item._id}
              renderItem={this.renderItem.bind(this)}
            />
          </View>
        </ScrollView>
        <BottomButton
          text={I18n.t('done')}
          backgroundColor={Colors.primary}
          textColor={Colors.snow}
          onPress={() => this.onDonePress()}
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
  return bindActionCreators(AuthActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InstrumentsScreen)
