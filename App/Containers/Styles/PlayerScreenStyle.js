import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  avatar: {
    width: Metrics.screenWidth - 40,
    height: (Metrics.screenWidth - 40) * 2 / 3,
    marginHorizontal: Metrics.doubleBaseMargin,
    marginTop: Metrics.doubleBaseMargin
  },
  overlay: {
    width: Metrics.screenWidth - 40,
    height: (Metrics.screenWidth - 40) * 2 / 3,
    borderRadius: 3,
    position: 'absolute',
    backgroundColor: Colors.windowTint,
    top: Metrics.doubleBaseMargin,
    left: Metrics.doubleBaseMargin
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 30
  },
  genres: {
    position: 'absolute',
    bottom: 10,
    left: 30,
    width: Metrics.screenWidth - 60
  },
  instrumentTags: {
    ...Fonts.style.description,
    color: Colors.snow,
    marginTop: Metrics.smallMargin
  },
  titleBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Metrics.baseMargin,
    marginHorizontal: Metrics.doubleBaseMargin
  },
  mainSongName: {
    ...Fonts.style.h3,
    color: Colors.primary,
    alignSelf: 'center',
    marginHorizontal: Metrics.doubleBaseMargin
  },
  author: {
    ...Fonts.style.normal,
    color: Colors.grey
  },
  mediaControls: {
    marginHorizontal: Metrics.doubleBaseMargin
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: Metrics.doubleBaseMargin
  },
  listTitle: {
    ...Fonts.style.h5,
    marginHorizontal: Metrics.doubleBaseMargin
  },
  row: {
    flexDirection: 'row',
    marginLeft: Metrics.doubleBaseMargin,
    paddingRight: Metrics.doubleBaseMargin,
    paddingVertical: Metrics.baseMargin,
    paddingLeft: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    alignItems: 'center'
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
  }
})
