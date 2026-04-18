import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADII, SHADOWS } from '../theme/theme';

interface DifficultyCardProps {
  difficulty: string;
  subtitle: string;
  emoji: string;
  accentColor: string;
  onPress: () => void;
}

export const DifficultyCard: React.FC<DifficultyCardProps> = ({
  difficulty,
  subtitle,
  emoji,
  accentColor,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [isSelecting, setIsSelecting] = useState(false);

  const handlePressIn = () => {
    setIsSelecting(true);
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    // Keep tint active briefly before firing
    setTimeout(() => {
       setIsSelecting(false);
       onPress();
    }, 150);
  };

  return (
    <Animated.View style={{ transform: [{ scale }], width: '100%', marginBottom: SPACING.md }}>
      <TouchableOpacity
        style={[
          styles.card,
          { borderLeftColor: accentColor },
          isSelecting && { backgroundColor: accentColor + '0D' } // 0D is ~5% opacity tint
        ]}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${difficulty} difficulty. ${subtitle}`}
      >
        <View style={styles.content}>
          <View style={[styles.iconSquare, { backgroundColor: accentColor + '15' }]}>
            <Text style={styles.emojiText}>{emoji}</Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{difficulty}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={[styles.arrowBtn, { backgroundColor: accentColor + '10' }]}>
             <Text style={[styles.arrowIcon, { color: accentColor }]}>→</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    borderLeftWidth: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  iconSquare: {
    width: 60,
    height: 60,
    borderRadius: RADII.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  emojiText: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.medium as any,
    color: COLORS.textSecondary,
    lineHeight: 20,
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
});
