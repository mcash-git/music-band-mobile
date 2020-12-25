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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25
    // resizeMode: 'cover'
  },
  name: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    marginLeft: Metrics.baseMargin
  },
  address: {
    ...Fonts.style.description,
    fontSize: 12,
    marginTop: 3,
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
    marginLeft: 10
  },
  cover: {
    width: (Metrics.screenWidth - (5 * Metrics.baseMargin)) / 3,
    height: (Metrics.screenWidth - (5 * Metrics.baseMargin)) / 3,
    // resizeMode: 'cover',
    marginRight: Metrics.baseMargin,
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
  songs: {
    // backgroundColor: Colors.snow
  },
  row: {
    flexDirection: 'row',
    marginLeft: Metrics.baseMargin,
    padding: Metrics.baseMargin,
    paddingLeft: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    alignItems: 'center'
  },
  songImage: {
    width: 50,
    height: 50,
    // resizeMode: 'cover',
    borderRadius: 3
  },
  songInfo: {
    flex: 1,
    paddingHorizontal: Metrics.baseMargin
  },
  songName: {
    ...Fonts.style.description,
    fontSize: 13
  },
  songTime: {
    ...Fonts.style.description,
    color: Colors.grey,
    marginTop: 3,
    fontSize: 11
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  action: {
    height: 25,
    width: 100,
    borderRadius: 15,
    flexDirection: 'row',
    backgroundColor: Colors.snow,
    marginVertical: Metrics.baseMargin,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionIcon: {
    width: 13,
    height: 13,
    resizeMode: 'contain'
  },
  actionText: {
    ...Fonts.style.description,
    color: Colors.primary,
    fontSize: 14,
    marginLeft: Metrics.smallMargin
  }
})
