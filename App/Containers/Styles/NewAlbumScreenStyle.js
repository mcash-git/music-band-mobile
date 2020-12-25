import { StyleSheet, StatusBar } from 'react-native'
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  sendButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: Metrics.baseMargin
  },
  albumInputs: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'center',
    backgroundColor: Colors.snow
  },
  addCoverBlock: {
    width: 120,
    height: 100,
    marginHorizontal: Metrics.baseMargin
  },
  coverDisk: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    position: 'absolute',
    right: 0,
    top: 12.5,
    backgroundColor: Colors.lightGrey
  },
  addCoverButton: {
    width: 100,
    height: 100,
    // resizeMode: 'cover',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7'
  },
  albumCover: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    position: 'absolute'
  },
  addCoverOverlay: {
    width: 100,
    height: 100,
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: Colors.windowTint
  },
  addCoverIcon: {
    width: 30,
    height: 30,
    opacity: 0.8,
    resizeMode: 'contain'
  },
  addCoverText: {
    ...Fonts.style.description,
    color: Colors.primary,
    marginTop: Metrics.smallMargin
  },
  selectBand: {
    ...Fonts.style.normal,
    color: Colors.grey
  },
  bandName: {
    ...Fonts.style.normal
  },
  inputAlbumName: {
    ...Fonts.style.h4,
    color: Colors.primary
    // flex: 1
  },
  inputDescription: {
    ...Fonts.style.description,
    minHeight: 30,
    backgroundColor: Colors.snow,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    padding: 15
  },
  instrumentsView: {
    backgroundColor: Colors.snow
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Metrics.baseMargin,
    // marginTop: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    height: 40,
    padding: Metrics.smallMargin
  },
  songTitle: {
    ...Fonts.style.description,
    fontWeight: 'bold',
    marginLeft: Metrics.smallMargin,
    flex: 1
  },
  instruments: {
    flexDirection: 'row',
    flex: 1
  },
  selectInstruments: {
    ...Fonts.style.description,
    color: Colors.grey
  },
  closeButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  tag: {
    width: 70,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    marginRight: Metrics.baseMargin
  },
  closeButtonSmall: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    position: 'absolute',
    left: 4,
    top: 4
  },
  smallIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain'
  },
  plusIconSmall: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  addSongText: {
    ...Fonts.style.description,
    color: Colors.primary,
    marginLeft: Metrics.baseMargin
  },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.baseMargin,
    backgroundColor: Colors.lightGrey
  },
  member: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
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
  memberAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: 'cover'
  }
})
