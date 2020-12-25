import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.steel
  },
  header: {
    // height: 60,
    backgroundColor: Colors.snow,
    justifyContent: 'flex-end',
    padding: Metrics.baseMargin
  },
  lastUpdateText: {
    ...Fonts.style.description,
    fontSize: 12,
    color: Colors.steel
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  headerTitle: {
    ...Fonts.style.h4,
    fontWeight: 'bold',
    flex: 1
  },
  iconSmall: {
    width: Metrics.icons.small,
    height: Metrics.icons.small,
    resizeMode: 'contain'
  },
  main: {
    flex: 1
  },
  buttonSmall: {
    paddingLeft: 15
  }
})
