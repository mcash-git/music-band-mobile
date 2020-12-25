import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  searchBlock: {
    paddingBottom: Metrics.baseMargin,
    backgroundColor: Colors.snow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey
  },
  tabbarUnderLine: {
    height: 1,
    backgroundColor: Colors.primary
  },
  tabbarText: {
    ...Fonts.style.normal
  },
  resultNumber: {
    margin: Metrics.baseMargin,
    ...Fonts.style.description,
    fontSize: 12,
    color: Colors.grey
  },
  row: {
    flexDirection: 'row',
    backgroundColor: Colors.snow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    paddingHorizontal: Metrics.baseMargin,
    paddingVertical: Metrics.baseMargin,
    alignItems: 'center'
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
  info: {
    flex: 1
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
  songImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
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

  band: {
    height: Metrics.screenWidth * 2 / 3,
    backgroundColor: Colors.snow
  },
  cover: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth * 2 / 3,
    position: 'absolute'
  },
  overlay: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth * 2 / 3,
    backgroundColor: Colors.windowTint,
    position: 'absolute'
  },
  bandContent: {
    position: 'absolute',
    bottom: Metrics.baseMargin,
    padding: Metrics.baseMargin
  },
  bandName: {
    ...Fonts.style.normal,
    color: Colors.snow
  },
  ratingText: {
    ...Fonts.style.description,
    color: 'yellow',
    fontSize: 11,
    marginTop: 3
  },
  rowTags: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Metrics.screenWidth - Metrics.doubleBaseMargin
  },
  tags: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5
  },
  tag: {
    paddingHorizontal: Metrics.baseMargin,
    paddingVertical: 3,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    marginRight: Metrics.baseMargin
  },
  tagName: {
    ...Fonts.style.description,
    color: Colors.snow,
    fontSize: 11
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40
  },
  playIcon: {
    width: 30,
    height: 30,
    borderRadius: 15
  }
})
