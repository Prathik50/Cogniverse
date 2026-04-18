/**
 * SuiteCard — Individual Therapy Suite Card
 * ==========================================
 * ALL content lives inside this card. Nothing leaks to the parent.
 *
 * Layout (top to bottom):
 *   [4px accent strip]
 *   [Large icon — 80×80 rounded square]
 *   [Suite name — bold 28px]
 *   [Module count pill badge]
 *   [Description — 2-3 lines muted]
 *   [Full-width CTA button]
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const SuiteCard = ({
  title,
  description,
  moduleCount,
  IconComponent,
  accentColor,
  onPress,
}) => {
  return (
    <View style={[styles.card, { borderTopColor: accentColor }]}>
      {/* ── Icon ── */}
      <View style={[styles.iconBox, { backgroundColor: accentColor + '14' }]}>
        <IconComponent size={44} color={accentColor} />
      </View>

      {/* ── Title ── */}
      <Text style={styles.title} accessibilityRole="header" numberOfLines={2}>
        {title}
      </Text>

      {/* ── Module badge ── */}
      {moduleCount > 0 && (
        <View style={[styles.badge, { backgroundColor: accentColor + '14' }]}>
          <View style={[styles.badgeDot, { backgroundColor: accentColor }]} />
          <Text style={[styles.badgeText, { color: accentColor }]}>
            {moduleCount} {moduleCount === 1 ? 'module' : 'modules'}
          </Text>
        </View>
      )}

      {/* ── Description ── */}
      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>

      {/* ── CTA ── */}
      <TouchableOpacity
        style={[styles.cta, { backgroundColor: accentColor }]}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityLabel={`Open ${title}`}
        accessibilityRole="button"
        accessibilityHint={`Opens the ${title} suite with ${moduleCount} modules`}
      >
        <Text style={styles.ctaText}>Explore Suite →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderTopWidth: 4,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 12,
    lineHeight: 34,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  cta: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default SuiteCard;
