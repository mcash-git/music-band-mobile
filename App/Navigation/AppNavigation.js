import React from 'react'
import { Platform, StyleSheet } from 'react-native'

// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import {
  Scene,
  Router,
  Actions,
  Reducer,
  // ActionConst,
  Overlay,
  Tabs,
  Modal,
  // Drawer,
  Stack,
  Lightbox
} from 'react-native-router-flux'
import { Colors, Images, Fonts } from '../Themes'
import I18nJs from 'react-native-i18n'
// import MenuIcon from './images/menu_burger.png'

import TabIcon from '../Components/TabIcon'
import MessageBar from '../Components/MessageBar'
// import CustomNavBar from '../Components/CustomNavBar'
import Websocket from '../Components/Websocket'

import Launch from '../Containers/LaunchScreen'
import RegisterScreen from '../Containers/RegisterScreen'
import LoginScreen from '../Containers/LoginScreen'
import ForgotPasswordScreen from '../Containers/ForgotPasswordScreen'
import InstrumentsScreen from '../Containers/InstrumentsScreen'
import HomeScreen from '../Containers/HomeScreen'
import SearchScreen from '../Containers/SearchScreen'
import VideoScreen from '../Containers/VideoScreen'
import NewPostScreen from '../Containers/NewPostScreen'
import NewAlbumScreen from '../Containers/NewAlbumScreen'
import SearchFilterScreen from '../Containers/SearchFilterScreen'
import BandsScreen from '../Containers/BandsScreen'
import TopGenresScreen from '../Containers/TopGenresScreen'
import BandDetailScreen from '../Containers/BandDetailScreen'
import BandCreateScreen from '../Containers/BandCreateScreen'
import MessageScreen from '../Containers/MessageScreen'
import ChatScreen from '../Containers/ChatScreen'
import MyProfileScreen from '../Containers/MyProfileScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import ProfileSearchScreen from '../Containers/ProfileSearchScreen'
import ProfileEditScreen from '../Containers/ProfileEditScreen'
import PlayerScreen from '../Containers/PlayerScreen'
import AlbumScreen from '../Containers/AlbumScreen'
import PhotoScreen from '../Containers/PhotoScreen'
import SettingScreen from '../Containers/SettingScreen'
import PostCommentScreen from '../Containers/PostCommentScreen'
import SearchUserScreen from '../Containers/SearchUserScreen'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabBarStyle: {
    backgroundColor: Colors.snow
  },
  tabBarSelectedItemStyle: {
    backgroundColor: Colors.snow
  },
  navbarStyle: {
    backgroundColor: Colors.snow,
    borderBottomWidth: 0,
    elevation: 0
  },
  title: {
    ...Fonts.style.description,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16
  },
  backTitle: {
    ...Fonts.style.description,
    color: Colors.grey,
    fontSize: 14
  }
})

const reducerCreate = params => {
  const defaultReducer = new Reducer(params)
  return (state, action) => {
    console.log('ACTION:', action)
    return defaultReducer(state, action)
  }
}

const getSceneStyle = () => ({
  backgroundColor: Colors.snow,
  shadowOpacity: 1,
  shadowRadius: 3
})

// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS === 'android' ? 'MusicBands://MusicBands/' : 'MusicBands://'

const AppNavigation = () => (
  <Router
    createReducer={reducerCreate}
    getSceneStyle={getSceneStyle}
    uriPrefix={prefix}>
    <Overlay key='overlay'>
      <Modal
        key='modal'
        backButtonTintColor={Colors.grey}
        backTitle={I18nJs.t('back')}
        backButtonTextStyle={styles.backTitle}
        navigationBarStyle={styles.navbarStyle}
      >
        <Lightbox key='lightbox'>
          <Stack
            hideNavBar
            key='root'
            titleStyle={styles.title}
            backButtonTintColor={Colors.grey}
            backTitle={I18nJs.t('back')}
            backButtonTextStyle={styles.backTitle}
            navigationBarStyle={styles.navbarStyle}
          >
            <Tabs
              key='tabbar'
              swipeEnabled={false}
              showLabel={false}
              tabBarStyle={styles.tabBarStyle}
              lazy
              tabBarPosition={'bottom'}
            >
              <Scene
                key='homeScreen'
                title='Home'
                hideNavBar
                tabBarLabel='Home'
                icon={TabIcon}
                image={Images.iconHome}
                activeImage={Images.iconHomeActive}
                component={HomeScreen}
                onEnter={() => Actions.refresh({ enterTime: new Date() })}
              />

              <Scene
                key='searchScreen'
                title={I18nJs.t('findNewArtistsForYourBand')}
                hideNavBar={false}
                navigationBarStyle={styles.navbarStyle}
                icon={TabIcon}
                image={Images.iconSearch}
                activeImage={Images.iconSeacrhActive}
                component={SearchScreen}
                onEnter={() => Actions.refresh({ enterTime: new Date() })}
              />

              <Scene
                key='bandsScreen'
                title={I18nJs.t('findBands')}
                hideNavBar
                navigationBarStyle={styles.navbarStyle}
                icon={TabIcon}
                image={Images.iconBands}
                activeImage={Images.iconBandsActive}
                component={BandsScreen}
                onEnter={() => Actions.refresh({ enterTime: new Date() })}
              />
              <Scene
                key='messageScreen'
                hideNavBar
                component={MessageScreen}
                title='Message'
                icon={TabIcon}
                image={Images.iconChat}
                activeImage={Images.iconChatAcive}
                onEnter={() => Actions.refresh({ enterTime: new Date() })}
              />
              <Scene
                key='myProfileScreen'
                component={MyProfileScreen}
                title={I18nJs.t('myProfile')}
                icon={TabIcon}
                image={Images.iconProfile}
                activeImage={Images.iconProfileActive}
                onEnter={() => Actions.refresh({ enterTime: new Date() })}
              />
            </Tabs>

            <Scene
              key='newPostScreen'
              hideNavBar={false}
              back
              component={NewPostScreen}
              title=''
              panHandlers={null}
            />
            <Scene
              key='newAlbumScreen'
              hideNavBar={false}
              back
              component={NewAlbumScreen}
              title=''
              panHandlers={null}
            />
            <Scene
              key='bandDetailScreen'
              hideNavBar={false}
              navTransparent
              back
              component={BandDetailScreen}
              title=''
              panHandlers={null}
              backButtonTintColor='#fff'
            />
            <Scene
              key='bandCreateScreen'
              hideNavBar={false}
              back
              component={BandCreateScreen}
              title=''
              panHandlers={null}
            />
            <Scene
              key='topGenresScreen'
              hideNavBar={false}
              back
              component={TopGenresScreen}
              title=''
              panHandlers={null}
            />
            <Scene
              key='chatScreen'
              hideNavBar={false}
              back
              component={ChatScreen}
              title=''
              panHandlers={null}
            />
            <Scene
              key='profileSearchScreen'
              hideNavBar={false}
              back
              component={ProfileSearchScreen}
              title=''
              panHandlers={null}
            />
            <Scene
              key='profileScreen'
              hideNavBar={false}
              back
              component={ProfileScreen}
              title=''
              panHandlers={null}
            />
            <Scene
              key='profileEditScreen'
              hideNavBar={false}
              back
              component={ProfileEditScreen}
              title={I18nJs.t('editProfile')}
              panHandlers={null}
            />
            <Scene
              key='settingScreen'
              hideNavBar={false}
              back
              component={SettingScreen}
              panHandlers={null}
            />
          </Stack>
        </Lightbox>
        <Scene
          key='launch'
          component={Launch}
          title='Launch'
          hideNavBar
          initial
        />
        <Scene
          key='loginScreen'
          hideNavBar
          component={LoginScreen}
          title='Login'
          leftTitle='Cancel'
        />
        <Scene
          key='registerScreen'
          hideNavBar
          component={RegisterScreen}
          title='Register'
          backTitle='Back'
          panHandlers={null}
        />
        <Scene
          key='forgotPasswordScreen'
          hideNavBar={false}
          navTransparent
          component={ForgotPasswordScreen}
          title=''
          panHandlers={null}
        />
        <Scene
          key='instrumentsScreen'
          hideNavBar
          component={InstrumentsScreen}
          title='Instruments'
          panHandlers={null}
        />
        <Scene
          key='playerScreen'
          hideNavBar
          back
          component={PlayerScreen}
          title=''
          panHandlers={null}
        />
        <Scene
          key='albumScreen'
          hideNavBar={false}
          back
          component={AlbumScreen}
          title=''
          panHandlers={null}
        />
        <Scene
          key='videoScreen'
          hideNavBar
          back
          component={VideoScreen}
          title=''
          panHandlers={null}
        />
        <Scene
          key='photoScreen'
          hideNavBar
          back
          component={PhotoScreen}
          title=''
          panHandlers={null}
        />
        <Scene
          key='postCommentScreen'
          hideNavBar={false}
          back
          component={PostCommentScreen}
          title=''
          panHandlers={null}
        />
        <Scene
          key='searchFilterScreen'
          hideNavBar={false}
          back
          component={SearchFilterScreen}
          title=''
          panHandlers={null}
          headerMode='none'
        />
        <Scene
          key='searchUserScreen'
          hideNavBar={false}
          back
          component={SearchUserScreen}
          title=''
          panHandlers={null}
          headerMode='none'
        />
      </Modal>
      <Scene component={MessageBar} />
      <Scene component={Websocket} />
    </Overlay>
  </Router>
)

export default AppNavigation
