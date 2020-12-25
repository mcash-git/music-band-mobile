import { StyleSheet } from 'react-native'
import { Fonts, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  lastUpdateText: {
    ...Fonts.style.description,
    fontSize: 12,
    color: Colors.steel
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
  article: {
    marginTop: Metrics.baseMargin,
    backgroundColor: Colors.snow,
    borderRadius: 3
  },
  articleHeader: {
    padding: Metrics.baseMargin,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 30,
    height: 30,
    // resizeMode: 'cover',
    borderRadius: 15,
    marginRight: Metrics.baseMargin
  },
  bandName: {
    ...Fonts.style.description,
    fontWeight: 'bold'
  },
  videoPreview: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 2,
    justifyContent: 'flex-end'
  },
  videoCover: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 2,
    borderWidth: 1,
    borderColor: Colors.lightGrey
  },
  videoContent: {
    position: 'absolute',
    bottom: 0,
    width: Metrics.screenWidth,
    backgroundColor: Colors.windowTint,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Metrics.baseMargin
  },
  postStatus: {
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
    alignItems: 'center',
    padding: Metrics.baseMargin,
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
    // resizeMode: 'cover',
    borderRadius: 3
  },
  articleContent: {
    ...Fonts.style.description,
    fontSize: 14,
    marginHorizontal: Metrics.baseMargin,
    marginBottom: Metrics.baseMargin
  },
  albumCover: {
    width: 50,
    height: 40
  },
  albumDisk: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.lightGrey,
    right: 0,
    top: 5
  },
  buttonSmall: {
    paddingLeft: 15
  }
})
