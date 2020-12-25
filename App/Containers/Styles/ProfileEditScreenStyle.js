import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  rightButtonText: {
    ...Fonts.style.description,
    marginHorizontal: Metrics.baseMargin
  },
  header: {
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 25,
    backgroundColor: Colors.lightGrey,
    borderRadius: 12.5,
    margin: Metrics.baseMargin
  },
  iconCamera: {
    width: 16,
    height: 16,
    resizeMode: 'contain'
  },
  iconSmall: {
    width: Metrics.icons.small,
    height: Metrics.icons.small,
    resizeMode: 'contain'
  },
  changePhotoText: {
    ...Fonts.style.description,
    color: Colors.primary,
    marginLeft: Metrics.baseMargin
  },
  fullRow: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
    padding: Metrics.baseMargin
  },
  groupTitle: {
    ...Fonts.style.description,
    color: Colors.grey
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    marginLeft: Metrics.baseMargin,
    padding: Metrics.baseMargin,
    paddingLeft: 0
  },
  rowTitle: {
    ...Fonts.style.description,
    flex: 1
  },
  rowValue: {
    ...Fonts.style.description,
    marginRight: Metrics.baseMargin
  },
  placeholder: {
    ...Fonts.style.description,
    marginRight: Metrics.baseMargin,
    color: Colors.grey
  },
  instruments: {
    flexDirection: 'row',
    flex: 1
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
  pickerText: {
    ...Fonts.style.description,
    flex: 1,
    textAlign: 'left'
  }
})
