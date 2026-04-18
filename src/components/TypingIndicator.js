/**
 * TypingIndicator — Animated 3-dot "thinking" bubble
 * =====================================================
 * Displays three dots that bounce in sequence to indicate
 * the bot is generating a response. Uses staggered
 * Animated.loop sequences for a natural breathing rhythm.
 *
 * Props:
 *   @param {string} dotColor   - Fill color for each dot (default: primaryMuted)
 *   @param {number} dotSize    - Diameter of each dot     (default: 8)
 *
 * Accessibility:
 *   - Entire container announced as "CogniBot is thinking"
 *   - accessibilityLiveRegion="polite" so screen readers announce it
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, RADII, SPACING, SHADOWS } from '../theme';

// ── Number of dots and their stagger delay ──
const DOT_COUNT = 3;
const STAGGER_MS = 180;
const BOUNCE_DURATION = 520;

const TypingIndicator = ({ dotColor = COLORS.primaryMuted, dotSize = 8 }) => {
  // Create one Animated.Value per dot
  const dots = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    // Each dot runs an infinite loop: rest → up → rest
    const animations = dots.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          // Wait for stagger offset
          Animated.delay(i * STAGGER_MS),
          // Bounce up
          Animated.timing(anim, {
            toValue: 1,
            duration: BOUNCE_DURATION,
            useNativeDriver: true,
          }),
          // Bounce down
          Animated.timing(anim, {
            toValue: 0,
            duration: BOUNCE_DURATION,
            useNativeDriver: true,
          }),
          // Pause before next cycle (sync all three)
          Animated.delay((DOT_COUNT - 1 - i) * STAGGER_MS),
        ]),
      ),
    );

    // Start all dot loops in parallel
    Animated.parallel(animations).start();

    // Cleanup on unmount
    return () => animations.forEach((a) => a.stop());
  }, [dots]);

  return (
    <View
      style={styles.wrapper}
      accessible={true}
      accessibilityLabel="CogniBot is thinking"
      accessibilityLiveRegion="polite"
    >
      {/* Bot avatar (matches ChatBubble style) */}
      <View style={styles.avatar}>
        <Animated.Text style={styles.avatarEmoji}>🤖</Animated.Text>
      </View>

      {/* Dots bubble */}
      <View style={styles.bubble}>
        {dots.map((anim, i) => {
          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -6],
          });
          const opacity = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.35, 1],
          });

          return (
            <Animated.View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: dotColor,
                  transform: [{ translateY }],
                  opacity,
                  marginHorizontal: 3,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.base,
    marginVertical: SPACING.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderBottomLeftRadius: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md + 2,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  dot: {
    // Size, color, and radius applied dynamically
  },
});

export default TypingIndicator;
