import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  button: {
    height: 40,
    borderRadius: 40 / 2,
    width: Metrics.screenWidth * 7 / 9,
    alignSelf: 'center',
    // marginHorizontal: Metrics.section,
    // marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.snow,
    justifyContent: 'center'
  },
  buttonText: {
    ...Fonts.style.normal,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: Fonts.size.medium
    // marginVertical: Metrics.baseMargin
  }
})
