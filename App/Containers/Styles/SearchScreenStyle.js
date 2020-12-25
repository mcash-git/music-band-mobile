import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  searchBlock: {
    backgroundColor: Colors.snow,
    paddingBottom: Metrics.baseMargin
  },
  fakeSearchBar: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Metrics.baseMargin,
    paddingHorizontal: Metrics.baseMargin
  },
  input: {
    ...Fonts.style.description,
    color: Colors.border,
    marginLeft: Metrics.smallMargin,
    flex: 1
  },
  title: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    // fontSize: 18,
    margin: Metrics.baseMargin
  },
  artist: {
    width: 100,
    height: 140,
    borderRadius: 5,
    backgroundColor: Colors.snow,
    marginLeft: Metrics.baseMargin,
    paddingVertical: 10,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  inviteButton: {
    width: 70,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  iconTiny: {
    width: 10,
    height: 10,
    resizeMode: 'contain'
  },
  inviteText: {
    ...Fonts.style.description,
    fontSize: 10,
    color: Colors.snow,
    marginLeft: 3
  },
  artistName: {
    ...Fonts.style.description,
    fontSize: 13
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.snow,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    padding: Metrics.baseMargin
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
  iconSmall: {
    width: Metrics.icons.small,
    height: Metrics.icons.small
  }
})
