import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADII, SHADOWS } from '../theme/theme';

interface GameRowProps {
  title: string;
  description: string;
  emoji: string;
  accentColor: string;
  benefit: string;
  isNew?: boolean;
  isLast?: boolean;
  onPress: () => void;
}

export const GameRow: React.FC<GameRowProps> = ({
  title,
  description,
  emoji,
  accentColor,
  benefit,
  isNew = false,
  isLast = false,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
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
      <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${title} — ${benefit}`}
          accessibilityHint={description}
        >
          <View style={styles.content}>
            <View style={[styles.iconSquare, { backgroundColor: accentColor + '1A' }]}>
              <Text style={styles.emojiText}>{emoji}</Text>
            </View>
            
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
                {isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
              </View>
              
              <View style={[styles.benefitPill, { backgroundColor: accentColor + '15' }]}>
                <Text style={[styles.benefitText, { color: accentColor }]}>
                  {benefit}
                </Text>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
            </View>

            <View style={[styles.arrowBtn, { backgroundColor: accentColor + '15' }]}>
               <Text style={[styles.arrowIcon, { color: accentColor }]}>→</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Clean thin colored line divider */}
      {!isLast && (
        <View style={[styles.divider, { backgroundColor: accentColor + '30' }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    overflow: 'hidden',
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20, // Increased vertical breathing room to 20px as requested
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
    marginRight: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  newBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADII.sm,
    marginLeft: SPACING.sm,
  },
  newBadgeText: {
    color: COLORS.textOnDark,
    fontSize: 9,
    fontWeight: TYPOGRAPHY.weights.black as any,
    letterSpacing: 0.5,
  },
  benefitPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADII.full,
    marginBottom: SPACING.xs + 2,
  },
  benefitText: {
    fontSize: TYPOGRAPHY.sizes.caption,
    fontWeight: TYPOGRAPHY.weights.bold as any,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.medium as any,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: RADII.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.black as any,
  },
  divider: {
    height: 1,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.xl,
    borderRadius: 1,
  },
});
