import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  header: {
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
    fontSize: 11
  },
  rowTags: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Metrics.screenWidth - Metrics.doubleBaseMargin
  },
  tags: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 10
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
  followButton: {
    backgroundColor: Colors.snow,
    height: 25,
    width: 80,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  followText: {
    ...Fonts.style.description,
    color: Colors.primary
  },
  statitic: {
    flexDirection: 'row',
    padding: Metrics.baseMargin,
    backgroundColor: Colors.snow
  },
  statiticItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  number: {
    ...Fonts.style.h5,
    fontWeight: 'bold',
    color: Colors.primary
  },
  numberLabel: {
    ...Fonts.style.description,
    color: Colors.grey,
    fontSize: 11
  },
  addMember: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.snow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Metrics.smallMargin
  },
  plusIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain'
  },
  addMemberText: {
    ...Fonts.style.description,
    color: Colors.primary
  },
  members: {
    margin: Metrics.baseMargin
  },
  member: {
    width: 100,
    marginRight: Metrics.baseMargin,
    alignItems: 'center'
  },
  memberName: {
    ...Fonts.style.description,
    marginTop: Metrics.smallMargin,
    textAlign: 'center'
  },
  avatarOverlay: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.ricePaper,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pending: {
    ...Fonts.style.description,
    color: Colors.grey
  },
  songs: {
    backgroundColor: Colors.snow,
    padding: Metrics.baseMargin
  },
  song: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    padding: Metrics.baseMargin
  },
  songImage: {
    width: 50,
    height: 50,
    marginRight: Metrics.baseMargin
  },
  songName: {
    ...Fonts.style.description,
    fontWeight: 'bold',
    marginRight: Metrics.baseMargin
  },
  songTime: {
    ...Fonts.style.description,
    fontSize: 11,
    color: Colors.grey
  },
  empty: {
    ...Fonts.style.normal,
    color: Colors.grey,
    alignSelf: 'center'
  }
})
