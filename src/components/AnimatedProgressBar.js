/**
 * AnimatedProgressBar — Self-animating horizontal bar
 * =====================================================
 * Smoothly fills to the target percentage on mount
 * with a subtle shimmer effect on the fill.
 */

import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, RADII } from '../theme';

const AnimatedProgressBar = ({
  percent = 0,
  height = 10,
  fillColor = COLORS.primary,
  trackColor = COLORS.border,
  delay = 600,
  duration = 1200,
  borderRadius = 5,
  style,
}) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate fill
    Animated.timing(widthAnim, {
      toValue: Math.min(percent, 100),
      duration,
      delay,
      useNativeDriver: false, // width can't use native driver
    }).start();

    // Subtle shimmer loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1500, delay: delay + duration, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [percent]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View
      style={[{ height, backgroundColor: trackColor, borderRadius, overflow: 'hidden' }, style]}
      accessibilityLabel={`Progress ${Math.round(percent)} percent`}
      accessibilityRole="progressbar"
    >
      <Animated.View
        style={{
          height: '100%',
          backgroundColor: fillColor,
          borderRadius,
          width: animatedWidth,
        }}
      >
        {/* Shimmer highlight overlay */}
        <Animated.View
          style={[StyleSheet.absoluteFill, {
            backgroundColor: '#FFFFFF',
            opacity: shimmerOpacity,
            borderRadius,
          }]}
        />
      </Animated.View>
    </View>
  );
};

export default AnimatedProgressBar;
