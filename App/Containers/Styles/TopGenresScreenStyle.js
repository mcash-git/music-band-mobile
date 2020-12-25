import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  header: {
    // height: 100,
    backgroundColor: Colors.snow,
    justifyContent: 'flex-end',
    paddingHorizontal: Metrics.baseMargin,
    paddingBottom: Metrics.baseMargin
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
  iconTiny: {
    width: Metrics.icons.tiny,
    height: Metrics.icons.tiny,
    resizeMode: 'contain'
  },
  searchBlock: {
    backgroundColor: Colors.snow
    // paddingBottom: Metrics.baseMargin
  },
  fakeSearchBar: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: Metrics.baseMargin,
    marginTop: Metrics.smallMargin,
    paddingHorizontal: Metrics.baseMargin
  },
  input: {
    ...Fonts.style.description,
    color: Colors.border,
    marginLeft: Metrics.smallMargin
  },
  bands: {
    marginHorizontal: Metrics.baseMargin
  },
  band: {
    width: 200,
    height: 200,
    marginRight: Metrics.baseMargin
  },
  cover: {
    position: 'absolute',
    width: 200,
    height: 200
  },
  overlay: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: Colors.windowTint
  },
  bandName: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    color: Colors.snow,
    marginTop: 140,
    marginHorizontal: Metrics.baseMargin
  },
  tags: {
    flexDirection: 'row',
    marginTop: Metrics.smallMargin,
    width: 190,
    overflow: 'hidden'
  },
  tag: {
    height: 14,
    borderRadius: 8,
    backgroundColor: Colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Metrics.smallMargin,
    marginLeft: Metrics.baseMargin
  },
  tagText: {
    ...Fonts.style.description,
    color: Colors.grey,
    fontSize: 10
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
    ...Fonts.style.normal,
    flex: 1,
    fontSize: 16
  },
  address: {
    ...Fonts.style.description,
    color: Colors.grey
  }
})
