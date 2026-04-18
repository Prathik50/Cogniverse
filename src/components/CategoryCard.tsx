import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { RADII, SPACING, COLORS, SHADOWS } from '../theme';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  width: number;
  onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, color, width, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <AnimatedTouchable
      style={[
        styles.card,
        { 
          width, 
          borderColor: color,
          transform: [{ scale }] 
        }
      ]}
      activeOpacity={0.9}
      onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name} category`}
    >
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Text style={styles.icon} allowFontScaling={false}>{icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text 
          style={styles.name}
          numberOfLines={2}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.7}
        >
          {name}
        </Text>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140, // Specifically requested to expand card heights
    borderWidth: 2,
    ...SHADOWS.sm,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 48,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  name: {
    fontSize: 16, // Matched their explicitly requested font size
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    width: '100%',
    flexShrink: 1,
    lineHeight: 22,
  },
});
