import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TYPOGRAPHY, RADII, SPACING } from '../theme/theme';

interface CategoryTabProps {
  id: string;
  label: string;
  emoji: string;
  color: string;
  isActive: boolean;
  onPress: () => void;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({ label, emoji, color, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        isActive ? { backgroundColor: '#FFFFFF' } : { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[
        styles.label,
        isActive ? { color: color } : { color: '#FFFFFF' }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.xs,
  },
  emoji: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.black as any,
  },
});
