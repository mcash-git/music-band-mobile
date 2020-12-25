import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes'

export default StyleSheet.create({
  searchBlock: {
    height: 30,
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    marginHorizontal: Metrics.baseMargin,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Metrics.baseMargin
  },
  icon: {
    width: Metrics.icons.tiny,
    height: Metrics.icons.tiny,
    resizeMode: 'contain'
  },
  input: {
    ...Fonts.style.description,
    flex: 1,
    height: 30,
    padding: 0,
    marginLeft: Metrics.smallMargin
  }
})
