/**
 * ChatBubble — Individual chat message component
 * =================================================
 * Renders a single message in the CogniBot conversation.
 *
 * Bot messages:  left-aligned white card with dark text + robot avatar
 * User messages: right-aligned purple bubble with white text
 *
 * Props:
 *   @param {string}  text          - The message body
 *   @param {'bot'|'user'} sender   - Who sent the message
 *   @param {boolean} isFirstBot    - If true, renders quick-reply chips below
 *   @param {Array}   quickReplies  - Chip labels (only shown when isFirstBot)
 *   @param {Function} onChipPress  - Callback when a quick-reply chip is tapped
 *
 * Accessibility:
 *   - Each bubble has accessibilityLiveRegion="polite"
 *   - Screen reader announces "{sender} said: {text}"
 *   - Quick-reply chips have accessibilityRole="button"
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import {
  COLORS,
  SPACING,
  RADII,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
} from '../theme';

// ════════════════════════════════════════════════
// QUICK-REPLY CHIP
// ════════════════════════════════════════════════
const QuickChip = ({ label, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={chipStyles.chip}
        onPress={() => onPress(label)}
        activeOpacity={0.8}
        onPressIn={() =>
          Animated.spring(scale, {
            toValue: 0.93,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }).start()
        }
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityHint={`Ask CogniBot about ${label}`}
      >
        <Text style={chipStyles.chipText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const chipStyles = StyleSheet.create({
  chip: {
    backgroundColor: '#EEF2FF',
    borderRadius: RADII.pill,
    paddingHorizontal: SPACING.base + 2,
    paddingVertical: SPACING.sm + 2,
    marginRight: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  chipText: {
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
    letterSpacing: 0.2,
  },
});

// ════════════════════════════════════════════════
// MAIN CHAT BUBBLE
// ════════════════════════════════════════════════
const ChatBubble = ({
  text,
  sender,
  isFirstBot = false,
  quickReplies = [],
  onChipPress,
}) => {
  const isBot = sender === 'bot';

  // ── Entrance animation ──
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isBot ? -20 : 20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.row,
        {
          justifyContent: isBot ? 'flex-start' : 'flex-end',
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
      accessible={true}
      accessibilityLabel={`${isBot ? 'CogniBot' : 'You'} said: ${text}`}
      accessibilityLiveRegion="polite"
    >
      {/* ── Bot avatar (left side) ── */}
      {isBot && (
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🤖</Text>
        </View>
      )}

      {/* ── Bubble + optional chips ── */}
      <View style={styles.contentCol}>
        <View style={isBot ? styles.botBubble : styles.userBubble}>
          <Text
            style={isBot ? styles.botText : styles.userText}
            selectable={true}
          >
            {text}
          </Text>
        </View>

        {/* Quick-reply chips (only on first bot message) */}
        {isFirstBot && quickReplies.length > 0 && (
          <View style={styles.chipsRow}>
            {quickReplies.map((label) => (
              <QuickChip key={label} label={label} onPress={onChipPress} />
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Row container ──
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
  },

  // ── Bot avatar circle ──
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    // Keep avatar at bottom of the row
    marginBottom: 2,
  },
  avatarEmoji: {
    fontSize: 18,
  },

  // ── Content column (bubble + chips) ──
  contentCol: {
    maxWidth: '78%',
    flexShrink: 1,
  },

  // ── Bot bubble (white card, left-aligned) ──
  botBubble: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderBottomLeftRadius: SPACING.xs,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },

  // ── User bubble (purple, right-aligned) ──
  userBubble: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.lg,
    borderBottomRightRadius: SPACING.xs,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    ...SHADOWS.md,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
  },

  // ── Text styles ──
  botText: {
    fontSize: FONT_SIZES.subhead,
    color: COLORS.textPrimary,
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.medium,
  },
  userText: {
    fontSize: FONT_SIZES.subhead,
    color: COLORS.textOnDark,
    lineHeight: 24,
    fontWeight: FONT_WEIGHTS.semibold,
  },

  // ── Quick-reply chips row ──
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
});

export default ChatBubble;
