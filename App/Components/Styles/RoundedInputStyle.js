import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  inputContainer: {
    // height: 40,
    width: Metrics.screenWidth * 8 / 9,
    alignSelf: 'center',
    marginVertical: 10
  },
  inputWrap: {
    borderRadius: 40 / 2,
    height: 40,
    backgroundColor: Colors.snow,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center'
    // borderWidth: 1
  },
  icon: {
    ...ApplicationStyles.iconSmall
  },
  inputText: {
    flex: 1,
    ...Fonts.style.normal,
    color: Colors.text,
    marginLeft: 10,
    fontSize: Fonts.size.medium
    // fontWeight: 'bold',
    // marginVertical: Metrics.baseMargin
  },
  error: {
    ...Fonts.style.description,
    color: Colors.primary,
    marginTop: 3,
    marginHorizontal: 15
  }
})
