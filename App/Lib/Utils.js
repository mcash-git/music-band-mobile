
import config from 'react-native-config'

export const url = (uri) => {
  return /^(https?:\/\/)/.test(uri) ? uri : `${config.BASE_URL}/${uri}`
}
