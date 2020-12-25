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
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGrey
  },
  icon: {
    ...ApplicationStyles.iconSmall
  },
  inputText: {
    flex: 1,
    ...Fonts.style.normal,
    color: Colors.text,
    marginLeft: 5,
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
