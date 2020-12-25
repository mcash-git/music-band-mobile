import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Slider from 'react-native-slider'
import { Colors, Fonts } from '../Themes'
import moment from 'moment'
import TrackPlayer from 'react-native-track-player'

class PlayerBar extends TrackPlayer.ProgressComponent {
  onSeek (value) {
    TrackPlayer.seekTo(value * this.state.duration)
  }

  render () {
    return (
      <View>
        <Slider
          value={this.getProgress()}
          onValueChange={value => this.onSeek(value)}
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.lightGrey}
        />
        <View style={styles.times}>
          <Text style={styles.time}>{moment().startOf('day').seconds(this.state.position).format('mm:ss')}</Text>
          <Text style={styles.time}>{moment().startOf('day').seconds(this.state.duration).format('mm:ss')}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  track: {
    height: 1
  },
  thumb: {
    width: 10,
    height: 10,
    backgroundColor: Colors.snow,
    borderWidth: 1,
    borderColor: Colors.grey
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  time: {
    ...Fonts.style.description,
    fontSize: 11,
    color: Colors.grey,
    marginTop: -10
  }
})

export default PlayerBar
