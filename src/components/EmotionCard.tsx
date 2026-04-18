import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { COLORS, RADII, SHADOWS, TYPOGRAPHY } from '../theme/theme';

const { width } = Dimensions.get('window');
const cardWidth = (width - 80) / 2;
const cardHeight = cardWidth * 1.1;

interface EmotionCardProps {
  emoji: string;
  label: string;
  onPress: () => void;
  disabled: boolean;
  status: 'neutral' | 'correct' | 'wrong';
}

export const EmotionCard: React.FC<EmotionCardProps> = ({
  emoji,
  label,
  onPress,
  disabled,
  status,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;

  // Status effects
  useEffect(() => {
    if (status === 'correct') {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.05, duration: 150, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }),
      ]).start();
    } else if (status === 'wrong') {
      Animated.sequence([
        Animated.timing(shake, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [status, scale, shake]);

  const isCorrect = status === 'correct';
  const isWrong = status === 'wrong';

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }, { translateX: shake }] }, { margin: 8 }]}>
      <TouchableOpacity
        style={[
          styles.card,
          isCorrect && styles.cardCorrect,
          isWrong && styles.cardWrong,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={`${label} emotion`}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <Text
          style={[
            styles.label,
            isCorrect && { color: COLORS.accentGreen },
            isWrong && { color: '#EF4444' },
          ]}
        >
          {label}
        </Text>

        {isCorrect && (
          <View style={styles.overlay}>
            <Text style={styles.checkmark}>✅</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: cardHeight,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  cardCorrect: {
    borderColor: COLORS.accentGreen,
    backgroundColor: '#D1FAE5',
  },
  cardWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 8,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.bold as any,
    color: COLORS.textPrimary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(209, 250, 229, 0.4)',
    borderRadius: RADII.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 48,
    opacity: 0.8,
  },
});
