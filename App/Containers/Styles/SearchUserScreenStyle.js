import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  searchBlock: {
    backgroundColor: Colors.snow,
    paddingBottom: 10,
    marginBottom: 10
  },
  rtistName: {
    ...Fonts.style.description,
    fontSize: 13
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.snow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    padding: Metrics.baseMargin
  },
  rowMiddle: {
    flex: 1,
    paddingHorizontal: Metrics.baseMargin
  },
  interests: {
    flexDirection: 'row',
    marginTop: 3
  },
  interest: {
    width: 60,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Metrics.smallMargin
  },
  artistAddress: {
    ...Fonts.style.description,
    fontSize: 11,
    color: Colors.grey
    // marginTop: 3
  },
  iconSmall: {
    width: Metrics.icons.small,
    height: Metrics.icons.small
  },
  iconTiny: {
    width: 10,
    height: 10,
    resizeMode: 'contain'
  }
})
