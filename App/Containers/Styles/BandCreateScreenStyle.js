import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Metrics, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  title: {
    ...Fonts.style.h4,
    fontWeight: 'bold',
    marginHorizontal: Metrics.baseMargin
  },
  sendButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: Metrics.baseMargin
  },
  header: {
    height: Metrics.screenWidth / 3 * 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey
  },
  cover: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 3 * 2,
    resizeMode: 'cover',
    position: 'absolute'
  },
  camera: {
    width: 60,
    height: 60,
    resizeMode: 'contain'
  },
  cameraText: {
    ...Fonts.style.description,
    color: Colors.primary,
    fontSize: 11,
    marginTop: Metrics.baseMargin
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    padding: Metrics.baseMargin
  },
  groupLabel: {
    ...Fonts.style.description,
    color: Colors.grey,
    margin: Metrics.baseMargin
  },
  iconSmall: {
    width: 15,
    height: 15
  },
  label: {
    ...Fonts.style.description,
    marginHorizontal: Metrics.baseMargin,
    flex: 1
  },
  value: {
    ...Fonts.style.description,
    marginRight: Metrics.baseMargin,
    maxWidth: Metrics.screenWidth / 2
  },
  placeholder: {
    ...Fonts.style.description,
    marginRight: Metrics.baseMargin,
    color: Colors.grey
  },
  instrumentsGroup: {
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey
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
  members: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Metrics.doubleBaseMargin,
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
  },
  pickerText: {
    ...Fonts.style.description,
    flex: 1,
    textAlign: 'left'
  }
})
