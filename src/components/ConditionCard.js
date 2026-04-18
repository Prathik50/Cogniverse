import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { COLORS, SPACING, RADII, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../theme';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ConditionCard = ({
  title,
  subtitle,
  description,
  color,
  IconComponent,
  onLearnMore,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={[styles.cardHeader, isExpanded && styles.cardHeaderExpanded]}
        onPress={toggleExpand}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${title}. ${subtitle}`}
        accessibilityHint="Tap to expand for more details"
      >
        <View style={[styles.iconSquare, { backgroundColor: color + '15' }]}>
          <IconComponent size={32} color={color} />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText} numberOfLines={isExpanded ? undefined : 1}>
            {subtitle}
          </Text>
        </View>

        <View style={[styles.chevronContainer, { backgroundColor: color + '10' }]}>
          <Text style={[styles.chevron, { color: color, transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }]}>
            ▼
          </Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.descriptionText}>{description}</Text>
          
          <TouchableOpacity
            style={[styles.learnMoreButton, { backgroundColor: color }]}
            onPress={onLearnMore}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Learn more about ${title}`}
          >
            <Text style={styles.learnMoreText}>Learn More →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  cardHeaderExpanded: {
    paddingBottom: SPACING.base,
  },
  iconSquare: {
    width: 60,
    height: 60,
    borderRadius: RADII.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: SPACING.xs,
  },
  titleText: {
    fontSize: FONT_SIZES.title3,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: '#1E293B',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: FONT_SIZES.subhead,
    color: '#64748B',
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 20,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: RADII.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.black,
  },
  expandedContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  descriptionText: {
    fontSize: FONT_SIZES.body,
    lineHeight: 24,
    color: '#475569',
    marginBottom: SPACING.lg,
  },
  learnMoreButton: {
    paddingVertical: SPACING.md,
    borderRadius: RADII.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  learnMoreText: {
    color: COLORS.textOnDark,
    fontSize: FONT_SIZES.subhead,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
});

export default ConditionCard;
