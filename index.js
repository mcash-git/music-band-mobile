import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'
import { Client } from 'bugsnag-react-native'
const bugsnag = new Client()

AppRegistry.registerComponent('MusicBands', () => App)
