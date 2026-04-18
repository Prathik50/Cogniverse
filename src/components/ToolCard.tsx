import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADII, SHADOWS } from '../theme/theme';

interface ToolCardProps {
  title: string;
  description: string;
  accentColor: string;
  IconComponent: React.ComponentType<{ size: number; color: string }>;
  onPress: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  accentColor,
  IconComponent,
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
    <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={description}
      >
        {/* Dynamic colored accent strip on the left edge */}
        <View style={[styles.accentStrip, { backgroundColor: accentColor }]} />
        
        <View style={styles.content}>
          <View style={[styles.iconSquare, { backgroundColor: accentColor + '1A' }]}>
            <IconComponent size={32} color={accentColor} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description} numberOfLines={3}>
              {description}
            </Text>
          </View>

          <View style={[styles.arrowBtn, { backgroundColor: accentColor + '15' }]}>
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
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  accentStrip: {
    width: 6,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  iconSquare: {
    width: 64,
    height: 64,
    borderRadius: RADII.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    letterSpacing: -0.3,
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
});
