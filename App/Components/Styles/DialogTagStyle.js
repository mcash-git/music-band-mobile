import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    // marginTop: Metrics.doubleBaseMargin,
    marginTop: Metrics.smallMargin,
    ...Fonts.style.normal,
    fontSize: 14,
    flex: 1
  },
  tagStyle: {
    ...Fonts.style.normal,
    fontSize: 14
  },
  button: {
    // backgroundColor: 'lightblue',
    height: 40,
    // margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flex: 1
  },
  modalContent: {
    width: '100%',
    height: 150,
    flexDirection: 'column',
    backgroundColor: 'white',
    // padding: Metrics.doubleBaseMargin,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
    flexDirection: 'row'
  },
  buttonText: {
    ...Fonts.style.normal
  },
  error: {
    ...Fonts.style.description,
    fontSize: 11,
    color: Colors.primary,
    marginBottom: Metrics.smallMargin
  }
})
