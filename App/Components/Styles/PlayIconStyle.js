import { StyleSheet } from 'react-native'
import { Metrics } from '../../Themes'

export default StyleSheet.create({
  container: {
    padding: Metrics.smallMargin
  },
  playIcon: {
    width: Metrics.icons.medium,
    height: Metrics.icons.medium,
    borderRadius: Metrics.icons.medium / 2,
    resizeMode: 'contain'
  }
})
