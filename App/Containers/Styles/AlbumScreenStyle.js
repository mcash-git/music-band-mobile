import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  album: {
    marginHorizontal: Metrics.baseMargin,
    flexDirection: 'row'
  },
  albumImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 3
  },
  albumCover: {
    width: 100,
    height: 80
  },
  albumDisk: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightGrey,
    right: 0,
    top: 10
  },
  albumContent: {
    marginLeft: Metrics.baseMargin
  },
  bandName: {
    ...Fonts.style.normal
  },
  albumName: {
    ...Fonts.style.h5,
    color: Colors.primary
  },
  description: {
    ...Fonts.style.description,
    fontSize: 13,
    margin: Metrics.baseMargin
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Metrics.baseMargin
  },
  index: {
    ...Fonts.style.description,
    fontSize: 13,
    color: Colors.grey
  },
  songContent: {
    flex: 1,
    marginHorizontal: Metrics.baseMargin
  },
  songName: {
    ...Fonts.style.description,
    fontSize: 13
  },
  hr: {
    marginLeft: 25,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight
  },
  members: {
    margin: Metrics.baseMargin
  },
  member: {
    width: 100,
    marginRight: Metrics.baseMargin,
    alignItems: 'center'
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: 'cover'
  },
  memberName: {
    ...Fonts.style.description,
    marginTop: Metrics.baseMargin
  }
})
