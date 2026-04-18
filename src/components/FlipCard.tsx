import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { COLORS, RADII, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

interface FlipCardProps {
  card: {
    id: number;
    emoji: string;
    label: string;
    isFlipped: boolean;
    isMatched: boolean;
  };
  onPress: () => void;
  disabled: boolean;
  cols: number;
  isWrong: boolean;
}

export const FlipCard: React.FC<FlipCardProps> = ({ card, onPress, disabled, cols, isWrong }) => {
  const flipValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const shakeValue = useRef(new Animated.Value(0)).current;

  // Sync flip state with prop
  useEffect(() => {
    Animated.spring(flipValue, {
      toValue: card.isFlipped || card.isMatched ? 1 : 0,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [card.isFlipped, card.isMatched, flipValue]);

  // Sync match pulse animation
  useEffect(() => {
    if (card.isMatched) {
      Animated.sequence([
        Animated.timing(scaleValue, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.spring(scaleValue, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }),
      ]).start();
    }
  }, [card.isMatched, scaleValue]);

  // Sync shake on wrong pair
  useEffect(() => {
    if (isWrong && card.isFlipped && !card.isMatched) {
      Animated.sequence([
        Animated.timing(shakeValue, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [isWrong, card.isFlipped, card.isMatched, shakeValue]);

  const cardSize = (width - 80) / cols - 12;

  const rotateYFront = flipValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const rotateYBack = flipValue.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const opacityFront = flipValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1, 0] });
  const opacityBack = flipValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled || card.isFlipped || card.isMatched}
      style={{ margin: 6, width: cardSize, height: cardSize + 10 }}
    >
      <View style={styles.cardContainer}>
        {/* FRONT DECK */}
        <Animated.View style={[
          styles.cardWrapper, styles.cardFront,
          {
            transform: [
              { rotateY: rotateYFront },
              { scale: scaleValue },
              { translateX: shakeValue }
            ],
            opacity: opacityFront,
          }
        ]}>
          <Text style={styles.cardQuestionMark}>?</Text>
        </Animated.View>

        {/* BACK DECK */}
        <Animated.View style={[
          styles.cardWrapper, styles.cardBack,
          card.isMatched && styles.cardMatched,
          {
            transform: [
              { rotateY: rotateYBack },
              { scale: scaleValue },
              { translateX: shakeValue }
            ],
            opacity: opacityBack,
          }
        ]}>
          <Text style={[styles.cardEmoji, { fontSize: cardSize * 0.45 }]}>{card.emoji}</Text>
          <Text style={styles.cardLabel}>{card.label}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  cardWrapper: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADII.lg,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    ...SHADOWS.card,
  },
  cardFront: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  cardBack: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
  },
  cardMatched: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    ...SHADOWS.elevated,
    shadowColor: '#10B981',
  },
  cardQuestionMark: {
    fontSize: 40,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.7)',
  },
  cardEmoji: {
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
