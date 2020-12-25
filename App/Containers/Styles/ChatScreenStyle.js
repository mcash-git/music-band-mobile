import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: Metrics.baseMargin
  },
  sendButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'contain',
    margin: 5
  },
  textInput: {
    ...Fonts.style.description,
    fontSize: 14,
    lineHeight: 18
  }
})
