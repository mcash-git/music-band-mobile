import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PhotoScreenStyle'
import { Metrics, Colors } from '../Themes'
import { Actions } from 'react-native-router-flux'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Gallery from 'react-native-image-gallery'
import { url } from '../Lib/Utils'
import SafeAreaView from 'react-native-safe-area-view'

class PhotoScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      index: props.imageIndex,
      images: props.images
    }
  }

  get caption () {
    const { images, index } = this.state
    return (
      <View style={styles.bottomView}>
        <Text style={styles.caption}>{(images[index] && images[index].caption) || ''} </Text>
      </View>
    )
  }

  get galleryCount () {
    const { index, images } = this.state
    return (
      <View style={styles.topView}>
        <Text style={styles.count}>{index + 1} / {images.length}</Text>
      </View>
    )
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Gallery
            style={{ flex: 1, backgroundColor: 'black' }}
            images={this.state.images.map(image => {
              return {
                source: { uri: url(image.filePath) },
                caption: image.caption
              }
            })}
            initialPage={this.props.imageIndex || 0}
            onPageSelected={(index) => this.setState({ index })}
          />
          {this.galleryCount}
          {this.caption}
          <TouchableOpacity style={styles.closeButton} onPress={Actions.pop}>
            <EvilIcons name='close-o' size={30} color={Colors.snow} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoScreen)
