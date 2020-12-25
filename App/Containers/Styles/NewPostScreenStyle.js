import { StyleSheet, StatusBar } from 'react-native'
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  containerContent: {
    flex: 1
  },
  sendButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: Metrics.baseMargin
  },
  postInputs: {
    flexDirection: 'row',
    padding: Metrics.baseMargin
    // height: 30
  },
  avatar: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
    borderRadius: 15,
    marginHorizontal: Metrics.baseMargin
  },
  input: {
    ...Fonts.style.description,
    flex: 1,
    padding: 0,
    marginLeft: Metrics.baseMargin
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Metrics.baseMargin,
    marginTop: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: '#F7F7F7',
    padding: Metrics.smallMargin
  },
  songTitle: {
    ...Fonts.style.description,
    fontWeight: 'bold'
  },
  albumName: {
    ...Fonts.style.description,
    fontSize: 12,
    color: Colors.grey,
    marginLeft: Metrics.smallMargin
  },
  bottomSection: {
    paddingBottom: Metrics.baseMargin
  },
  bottomBar: {
    flexDirection: 'row'
  },
  buttonImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: 'contain',
    marginLeft: Metrics.baseMargin,
    marginVertical: Metrics.baseMargin
  },
  albums: {
    flexDirection: 'row',
    margin: Metrics.baseMargin
  },
  addAlbumButton: {
    width: 90,
    height: 90,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Metrics.baseMargin
  },
  addButtonImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },
  addAlbumText: {
    ...Fonts.style.description,
    fontSize: 11,
    color: Colors.primary
  },
  albumButtonBackground: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    position: 'absolute'
  },
  albumOverlay: {
    width: 90,
    height: 90,
    backgroundColor: Colors.windowTint,
    position: 'absolute'
  },
  albumText: {
    ...Fonts.style.description,
    color: Colors.snow,
    marginHorizontal: Metrics.smallMargin,
    fontSize: 11,
    textAlign: 'center'
  },
  images: {
    paddingHorizontal: Metrics.baseMargin
  },
  imageWrap: {
    marginRight: 3
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover'
  },
  imageCover: {
    width: 100,
    height: 100,
    position: 'absolute',
    backgroundColor: Colors.windowTint
  },
  removeImage: {
    position: 'absolute',
    top: 5,
    right: 5
  },
  videoPreview: {
    width: Metrics.screenWidth - Metrics.doubleBaseMargin,
    height: (Metrics.screenWidth - Metrics.doubleBaseMargin) / 2,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    backgroundColor: '#000'
  },
  videoCover: {
    width: (Metrics.screenWidth - Metrics.doubleBaseMargin),
    height: (Metrics.screenWidth - Metrics.doubleBaseMargin) / 2,
    borderWidth: 1,
    borderColor: Colors.lightGrey
  },
  videoContent: {
    position: 'absolute',
    bottom: 0,
    width: (Metrics.screenWidth - Metrics.doubleBaseMargin),
    backgroundColor: Colors.windowTint,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Metrics.baseMargin
  },
  videoTitle: {
    ...Fonts.style.normal,
    fontWeight: 'bold',
    color: Colors.snow
  },
  genreTags: {
    ...Fonts.style.description,
    color: Colors.snow,
    marginTop: Metrics.smallMargin
  },
  audioGenreTags: {
    ...Fonts.style.description,
    fontSize: 12,
    color: Colors.grey
  },
  closeButton: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 10,
    right: 10
  },
  checkerAlbum: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 5,
    right: 5
  }
})
