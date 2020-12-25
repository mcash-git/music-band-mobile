import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  header: {
    backgroundColor: Colors.snow,
    flexDirection: 'row',
    paddingHorizontal: Metrics.baseMargin,
    justifyContent: 'space-between'
  },
  title: {
    ...Fonts.style.h3,
    marginBottom: Metrics.baseMargin
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.snow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    padding: Metrics.baseMargin
  },
  iconSmall: {
    width: Metrics.icons.small,
    height: Metrics.icons.small,
    resizeMode: 'contain'
  },
  iconTiny: {
    width: Metrics.icons.tiny,
    height: Metrics.icons.tiny,
    resizeMode: 'contain'
  },
  rowTitle: {
    ...Fonts.style.description,
    flex: 1,
    paddingHorizontal: Metrics.baseMargin
  },
  separate: {
    height: Metrics.baseMargin
  }
})
