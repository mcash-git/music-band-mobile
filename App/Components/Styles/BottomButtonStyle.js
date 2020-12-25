import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: Metrics.screenWidth,
    height: 80,
    alignItems: 'center',
    paddingTop: Metrics.baseMargin,
    backgroundColor: Colors.snow,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  text: {
    ...Fonts.style.normal,
    color: Colors.primary
  }
})
