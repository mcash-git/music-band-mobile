import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  list: {
    flex: 1,
    marginVertical: Metrics.doubleBaseMargin
  },
  item: {
    width: Metrics.screenWidth - 60
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
  itemName: {
    flex: 1,
    marginHorizontal: Metrics.baseMargin
  },
  hr: {
    marginLeft: 35,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: 10,
    marginBottom: 10
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
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
    flexDirection: 'row'
  },
  buttonText: {
    ...Fonts.style.normal
  }
})
