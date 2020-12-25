import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  title: {
    ...Fonts.style.normal,
    marginVertical: 20,
    alignSelf: 'center'
  },
  mainContainer: {
    // flex: 1,
    borderRadius: Metrics.smallMargin,
    marginHorizontal: Metrics.doubleBaseMargin,
    padding: Metrics.baseMargin,
    backgroundColor: Colors.snow
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  instrumentImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
  instrumentName: {
    flex: 1,
    marginHorizontal: Metrics.baseMargin
  },
  hr: {
    marginLeft: 35,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: 10,
    marginBottom: 10
  }
})
