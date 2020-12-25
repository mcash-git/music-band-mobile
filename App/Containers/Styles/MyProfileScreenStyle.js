import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  header: {
    flexDirection: 'row',
    backgroundColor: Colors.snow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    paddingHorizontal: Metrics.baseMargin,
    paddingVertical: Metrics.baseMargin
  },
  navButton: {
    paddingHorizontal: Metrics.baseMargin
  },
  iconSmall: {
    width: Metrics.icons.small,
    height: Metrics.icons.small,
    resizeMode: 'contain'
  },
  iconTiny: {
    width: 10,
    height: 10,
    resizeMode: 'contain'
  },
  name: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    marginLeft: Metrics.baseMargin
  },
  address: {
    ...Fonts.style.description,
    fontSize: 12,
    marginVertical: 3,
    marginLeft: Metrics.baseMargin,
    color: Colors.grey
  },
  instruments: {
    flexDirection: 'row',
    marginLeft: Metrics.baseMargin
  },
  instrument: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    marginRight: Metrics.smallMargin
  },
  statitics: {
    flexDirection: 'row',
    backgroundColor: Colors.snow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey
  },
  statitic: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Metrics.baseMargin
  },
  statiticValue: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    color: Colors.primary
  },
  statiticLabel: {
    ...Fonts.style.description,
    fontSize: 11,
    color: Colors.grey
  },
  title: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    margin: Metrics.baseMargin
  },
  bands: {
    backgroundColor: Colors.snow,
    paddingVertical: Metrics.baseMargin
  },
  band: {
    // alignItems: 'center',
    marginLeft: 10
  },
  cover: {
    width: (Metrics.screenWidth - (4 * Metrics.baseMargin)) / 3,
    height: (Metrics.screenWidth - (4 * Metrics.baseMargin)) / 3,
    // resizeMode: 'cover',
    borderRadius: 3
  },
  bandName: {
    ...Fonts.style.description,
    marginTop: Metrics.baseMargin,
    fontSize: 13,
    width: (Metrics.screenWidth - (4 * Metrics.baseMargin)) / 3
  },
  bandMembers: {
    ...Fonts.style.description,
    fontSize: 11,
    color: Colors.grey,
    marginTop: 3
  },
  overlay: {
    width: (Metrics.screenWidth - (4 * Metrics.baseMargin)) / 3,
    height: (Metrics.screenWidth - (4 * Metrics.baseMargin)) / 3,
    position: 'absolute',
    backgroundColor: Colors.ricePaper,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pending: {
    ...Fonts.style.description,
    color: Colors.primary
  },
  addMember: {
    width: (Metrics.screenWidth - (4 * Metrics.baseMargin)) / 3,
    height: (Metrics.screenWidth - (4 * Metrics.baseMargin)) / 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    borderRadius: 3
  },
  plusIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },
  createBandText: {
    ...Fonts.style.description,
    fontSize: 13,
    marginTop: Metrics.baseMargin,
    color: Colors.primary
  },
  empty: {
    ...Fonts.style.normal,
    color: Colors.grey,
    alignSelf: 'center'
  }
})
