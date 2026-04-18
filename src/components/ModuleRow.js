import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, SPACING, RADII, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../theme';

const ModuleRow = ({
  title,
  description,
  icon,
  accentColor,
  progress,
  onPress,
  isLast,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.card}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel={`${title}. ${progress}% done.`}
          accessibilityHint={description}
        >
          {/* Main Row Content */}
          <View style={styles.rowContent}>
            <View style={[styles.iconSquare, { backgroundColor: accentColor + '1A' }]}>
              <Text style={styles.emojiText}>{icon}</Text>
            </View>
            
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>{title}</Text>
                <View style={[styles.progressBadge, { backgroundColor: accentColor + '1A' }]}>
                  <Text style={[styles.progressText, { color: accentColor }]}>{progress}% done</Text>
                </View>
              </View>
              <Text style={styles.descriptionText} numberOfLines={2}>{description}</Text>
            </View>

            <View style={[styles.arrowContainer, { backgroundColor: accentColor }]}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Divider */}
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: accentColor + '33' }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    ...SHADOWS.sm,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSquare: {
    width: 64,
    height: 64,
    borderRadius: RADII.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  emojiText: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  titleText: {
    fontSize: FONT_SIZES.headline,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: '#1E293B',
    marginRight: SPACING.sm,
    letterSpacing: -0.3,
  },
  progressBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADII.pill,
  },
  progressText: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.3,
  },
  descriptionText: {
    fontSize: FONT_SIZES.small,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: FONT_WEIGHTS.medium,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: RADII.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
    shadowOpacity: 0.15,
  },
  arrowText: {
    color: COLORS.textOnDark,
    fontSize: FONT_SIZES.title3,
    fontWeight: FONT_WEIGHTS.black,
  },
  divider: {
    height: 1.5,
    marginTop: SPACING.sm,
    marginHorizontal: SPACING.xl,
    borderRadius: 1,
  },
});

export default ModuleRow;
