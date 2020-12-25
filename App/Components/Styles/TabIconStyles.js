import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // borderTopWidth: 4,
    width: Metrics.screenWidth / 4 - 25,
    borderTopColor: Colors.transparent
  },
  imageIcon: {
    width: 25,
    height: 25,
    // opacity: 0.8,
    marginTop: 8
  },
  imageIconSelected: {
    width: 25,
    height: 25,
    marginTop: 8
  },
  title: {
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 12,
    color: Colors.text
  },
  titleSelected: {
    textAlign: 'center',
    marginVertical: 5,
    fontSize: 12,
    color: Colors.tint
  }
})
