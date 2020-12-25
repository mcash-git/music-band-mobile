import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.steel
  },
  header: {
    // height: 80,
    backgroundColor: Colors.snow,
    justifyContent: 'flex-end',
    padding: Metrics.baseMargin
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
  searchBlock: {
    backgroundColor: Colors.snow,
    paddingBottom: Metrics.baseMargin
  },
  main: {
    flex: 1
  },
  title: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    // fontSize: 18,
    margin: Metrics.baseMargin
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.snow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    padding: Metrics.baseMargin
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover'
  },
  subRow: {
    flexDirection: 'row',
    marginLeft: Metrics.baseMargin
  },
  chatName: {
    ...Fonts.style.description,
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1
  },
  lastMessage: {
    ...Fonts.style.description,
    marginTop: Metrics.smallMargin,
    color: Colors.grey,
    fontSize: 13,
    flex: 1
  },
  chatTime: {
    ...Fonts.style.description,
    color: Colors.grey,
    fontSize: 11
  },
  unread: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: 'center'
  },
  unreadText: {
    ...Fonts.style.description,
    marginTop: Metrics.smallMargin,
    color: Colors.snow,
    paddingHorizontal: 7,
    paddingBottom: 3,
    fontSize: 11
  }
})
