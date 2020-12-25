import { StyleSheet, Platform } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.snow
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 10 : 20,
    right: 10
  },
  commentsView: {
    flex: 1
  },
  header: {
    // height: 100,
    // backgroundColor: Colors.snow,
    // justifyContent: 'flex-end',
    // padding: Metrics.baseMargin
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
  main: {
    flex: 1
  },
  authorView: {
    padding: Metrics.baseMargin,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.snow
  },
  bandName: {
    ...Fonts.style.description,
    fontWeight: 'bold'
  },
  videoPreview: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth * 2 / 3,
    // justifyContent: 'flex-end',
    backgroundColor: '#000'
  },
  videoCover: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth * 2 / 3
  },
  videoContent: {
    position: 'absolute',
    width: Metrics.screenWidth,
    height: Metrics.screenWidth * 2 / 3,
    backgroundColor: Colors.windowTint,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Metrics.baseMargin
  },
  videoStatus: {
    padding: Metrics.baseMargin,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  videoTitle: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    color: Colors.snow
  },
  instrumentTags: {
    ...Fonts.style.description,
    color: Colors.snow,
    marginTop: Metrics.smallMargin
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Metrics.baseMargin,
    marginLeft: Metrics.section,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  songContent: {
    flex: 1,
    padding: Metrics.baseMargin
  },
  songImage: {
    width: 40,
    height: 40,
    resizeMode: 'cover'
  },
  videoDescription: {
    marginHorizontal: Metrics.baseMargin,
    paddingBottom: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  commentContent: {
    flex: 1,
    paddingHorizontal: Metrics.baseMargin
  },
  commentText: {
    ...Fonts.style.description,
    fontWeight: 'normal',
    fontSize: 13
  },
  replyText: {
    ...Fonts.style.description,
    fontSize: 13
  },
  sendButton: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    borderRadius: 15
  }
})
