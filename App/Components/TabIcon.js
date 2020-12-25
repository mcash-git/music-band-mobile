import React from 'react'
import PropTypes from 'prop-types'
import { Image, Text, View } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/TabIconStyles'
import { Colors } from '../Themes'

const propTypes = {
  focused: PropTypes.bool
}

const TabIcon = (props) => {
  return props.focused ? (
    <View style={[styles.container]}>
      <Image source={props.activeImage} style={styles.imageIconSelected} />
      {/* <Text allowFontScaling={false}style={styles.titleSelected}>
        {props.title}
      </Text> */}
    </View>
    )
    : (
      <View style={styles.container}>
        <Image source={props.image} style={styles.imageIcon} />
        {/* <Text allowFontScaling={false}style={styles.title}>
          {props.title}
        </Text> */}
      </View>
    )
}

TabIcon.propTypes = propTypes

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabIcon)
