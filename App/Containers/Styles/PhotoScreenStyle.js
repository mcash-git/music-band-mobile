import { StyleSheet, Platform } from 'react-native'
import { ApplicationStyles, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 0 : 10,
    right: 0,
    padding: Metrics.baseMargin
  },
  topView: {
    top: 0,
    height: 65,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center'
  },
  count: {
    ...Fonts.style.description,
    textAlign: 'right',
    color: 'white',
    fontSize: 15,
    fontStyle: 'italic',
    marginRight: 45
  },
  bottomView: {
    bottom: 0,
    height: 65,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center'
  },
  caption: {
    ...Fonts.style.description,
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontStyle: 'italic'
  }
})
