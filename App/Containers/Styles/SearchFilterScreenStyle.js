import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  rightButtonText: {
    ...Fonts.style.description,
    marginHorizontal: Metrics.baseMargin
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  searchBlock: {
    backgroundColor: Colors.snow,
    paddingBottom: Metrics.baseMargin
  },
  title: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    // fontSize: 18,
    margin: Metrics.baseMargin
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.snow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    padding: Metrics.baseMargin
  },
  rowLabel: {
    ...Fonts.style.description,
    flex: 1,
    color: Colors.primary
  },
  rowValue: {
    ...Fonts.style.description,
    marginHorizontal: Metrics.baseMargin
  },
  placeholder: {
    ...Fonts.style.description,
    marginRight: Metrics.baseMargin,
    color: Colors.grey
  },
  iconSmall: {
    width: 10,
    height: 10
  },
  instrumentName: {
    flex: 1,
    marginHorizontal: Metrics.baseMargin
  },
  pickerText: {
    ...Fonts.style.description,
    textAlign: 'left'
  }
})
