import { useEventListener } from 'expo';
import { BlurView } from 'expo-blur';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const { width: W, height: H } = Dimensions.get('window');
const videoSize = Math.max(W, H) * 1.2;

const videoSource = require('@/assets/videos/background.mp4');

const FADE_DURATION = 800;

interface VideoBackgroundProps {}

export default function VideoBackground({}: VideoBackgroundProps) {
  const coverOpacity = useSharedValue(1);
  const hasRevealed = useRef(false);
  const fadeInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // Initial reveal + start loop crossfade timer
  useEventListener(player, 'playingChange', ({ isPlaying }) => {
    if (isPlaying && !hasRevealed.current) {
      hasRevealed.current = true;

      // Initial fade in
      coverOpacity.value = withDelay(
        300,
        withTiming(0, {
          duration: FADE_DURATION,
          easing: Easing.out(Easing.cubic),
        })
      );

      // Get video duration and set up crossfade at loop point
      const durationSec = player.duration;
      if (durationSec > 0) {
        const loopMs = durationSec * 1000;
        // Start checking near the end of each loop
        const fadeStart = loopMs - FADE_DURATION - 200;

        fadeInterval.current = setInterval(() => {
          // Fade to black then back — hides the loop seam
          coverOpacity.value = withSequence(
            withTiming(1, {
              duration: FADE_DURATION,
              easing: Easing.inOut(Easing.cubic),
            }),
            withDelay(
              100,
              withTiming(0, {
                duration: FADE_DURATION,
                easing: Easing.inOut(Easing.cubic),
              })
            )
          );
        }, loopMs);
      }
    }
  });

  const coverStyle = useAnimatedStyle(() => ({
    opacity: coverOpacity.value,
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', backgroundColor: '#000' }]}>
      {/* Video plays immediately — always rendering */}
      <View style={styles.rotatedContainer}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />
      </View>

      {/* Very subtle blur */}
      <BlurView
        intensity={8}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />

      {/* Heavy dim overlay — ~20% video visibility */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'rgba(0, 0, 0, 0.80)' },
        ]}
      />

      {/* Black cover — initial reveal + crossfade at loop seam */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: '#000' },
          coverStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rotatedContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: videoSize,
    height: videoSize,
    transform: [{ rotate: '90deg' }],
  },
});
