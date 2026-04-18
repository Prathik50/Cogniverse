/**
 * SocialSkillsSuite — Social Skills Learning Cards
 * ==================================================
 * Focused single-view card UI teaching critical social cues
 * with TTS voice support and animated transitions.
 *
 * Changes from original:
 * - Imported shared theme tokens
 * - Added accessibilityLabel/Role/Hint to all interactive elements
 * - Added Android BackHandler support
 * - Replaced 12-dot navigator with grouped dots + counter (UX improvement)
 * - Decorative elements hidden from accessibility tree
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';
import { BackArrowIcon } from '../components/icons/ConditionIcons';
import { COLORS, SPACING, RADII, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

// ── Social skills data ──
const SOCIAL_CARDS = [
  { emoji: '👋', title: 'Hello!', speech: 'We say Hello when we meet someone. Wave your hand and smile!', tip: 'Wave your hand and smile', color: '#6366F1' },
  { emoji: '🤝', title: 'Shaking Hands', speech: 'We shake hands when we greet someone. Hold out your hand and gently shake.', tip: 'Hold out your hand gently', color: '#10B981' },
  { emoji: '🙏', title: 'Thank You', speech: 'We say Thank You when someone does something nice for us. It makes them feel good!', tip: 'Say it when someone helps you', color: '#F59E0B' },
  { emoji: '😊', title: 'Smiling', speech: 'A smile shows people you are friendly. Try smiling when you see someone!', tip: 'Smile to show you are friendly', color: '#EC4899' },
  { emoji: '👀', title: 'Eye Contact', speech: 'Looking at someone when they talk shows you are listening. Try looking at their eyes or nose.', tip: 'Look at their eyes or nose', color: '#8B5CF6' },
  { emoji: '🙋', title: 'Asking for Help', speech: 'When you need help, raise your hand or say Excuse me, can you help me please?', tip: 'Say: Can you help me please?', color: '#EF4444' },
  { emoji: '🤗', title: 'Hugging', speech: 'We hug people we love, like mom and dad. Always ask first: Can I have a hug?', tip: 'Always ask before hugging', color: '#F97316' },
  { emoji: '👂', title: 'Listening', speech: 'Good listening means being quiet when someone is talking and looking at them.', tip: 'Be quiet and look at them', color: '#06B6D4' },
  { emoji: '🙇', title: 'Sorry', speech: 'We say Sorry when we make a mistake or hurt someone. It helps fix things.', tip: 'Say it when you make a mistake', color: '#64748B' },
  { emoji: '👋🏼', title: 'Goodbye', speech: 'We say Goodbye when someone is leaving. Wave and say See you later!', tip: 'Wave and say: See you later!', color: '#7C3AED' },
  { emoji: '🤲', title: 'Sharing', speech: 'Sharing means giving some of what you have to others. It makes everyone happy!', tip: 'Give some to a friend', color: '#059669' },
  { emoji: '⏳', title: 'Waiting Your Turn', speech: 'Sometimes we have to wait. Stand calmly and wait for your turn. You will get a chance!', tip: 'Stand calmly and be patient', color: '#D97706' },
];

// ── Decorative floating orb (hidden from a11y) ──
const FloatingOrb = ({ size, color, top, left, delay = 0 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 1000, delay, useNativeDriver: true }).start();
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0, duration: 3000 + delay, useNativeDriver: true }),
    ])).start();
  }, []);
  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  return (
    <Animated.View
      style={{ position: 'absolute', top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: opacityAnim, transform: [{ translateY }] }}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden={true}
    />
  );
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// ── Scale-on-press card wrapper ──
const TouchCard = ({ children, onPress, style, accessibilityLabel, accessibilityHint }) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <AnimatedTouchable
      style={[style, { transform: [{ scale }] }]}
      activeOpacity={0.9}
      onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
    >
      {children}
    </AnimatedTouchable>
  );
};

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────
const SocialSkillsSuite = ({ onBack }) => {
  const { speak } = useTTS();
  const { logActivity } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const headerFade = useRef(new Animated.Value(0)).current;

  const card = SOCIAL_CARDS[currentIndex];

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    animateCard();
  }, []);

  // ── Android hardware back support ──
  useEffect(() => {
    const onHardwareBack = () => { onBack(); return true; };
    BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBack);
  }, [onBack]);

  const animateCard = () => {
    cardScale.setValue(0.85);
    cardOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const handleNext = () => {
    const nextIdx = currentIndex < SOCIAL_CARDS.length - 1 ? currentIndex + 1 : 0;
    Animated.parallel([
      Animated.timing(cardScale, { toValue: 0.85, duration: 200, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex(nextIdx);
      logActivity('Social Skills', 1);
      animateCard();
    });
  };

  const handlePrev = () => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : SOCIAL_CARDS.length - 1;
    Animated.parallel([
      Animated.timing(cardScale, { toValue: 0.85, duration: 200, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex(prevIdx);
      animateCard();
    });
  };

  const handleSpeak = () => {
    speak(`${card.title}. ${card.speech}`);
  };

  const progress = ((currentIndex + 1) / SOCIAL_CARDS.length) * 100;

  // Show max 7 dots centered around current position (better for 12 items)
  const MAX_VISIBLE_DOTS = 7;
  const halfDots = Math.floor(MAX_VISIBLE_DOTS / 2);
  let dotStart = Math.max(0, currentIndex - halfDots);
  let dotEnd = Math.min(SOCIAL_CARDS.length, dotStart + MAX_VISIBLE_DOTS);
  if (dotEnd - dotStart < MAX_VISIBLE_DOTS) {
    dotStart = Math.max(0, dotEnd - MAX_VISIBLE_DOTS);
  }
  const visibleDots = SOCIAL_CARDS.slice(dotStart, dotEnd);

  return (
    <View style={styles.container}>
      {/* ── Background ── */}
      <View style={styles.waveContainer}>
        <Svg height={520} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="ssGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primaryDeep} />
              <Stop offset="40%" stopColor={card.color + 'CC'} />
              <Stop offset="100%" stopColor={card.color} />
            </LinearGradient>
          </Defs>
          <Path fill="url(#ssGrad)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <FloatingOrb size={70} color={card.color + '18'} top={60} left={width - 90} delay={0} />
      <FloatingOrb size={45} color={card.color + '20'} top={120} left={20} delay={300} />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Header ── */}
        <Animated.View style={[styles.headerTop, { opacity: headerFade }]}>
          <TouchCard
            style={styles.backButton}
            onPress={onBack}
            accessibilityLabel="Go back"
            accessibilityHint="Returns to Learning Center"
          >
            <BackArrowIcon size={22} color={card.color} />
          </TouchCard>
          <View style={styles.headerTitles}>
            <Text style={styles.title} accessibilityRole="header">Social Skills</Text>
            <Text style={styles.subtitleText}>{currentIndex + 1} of {SOCIAL_CARDS.length}</Text>
          </View>
        </Animated.View>

        {/* ── Progress bar ── */}
        <View style={styles.progressOuter} accessibilityLabel={`Progress: ${currentIndex + 1} of ${SOCIAL_CARDS.length} cards`}>
          <View style={[styles.progressInner, { width: `${progress}%`, backgroundColor: card.color }]} />
        </View>

        {/* ── Main Card ── */}
        <View style={styles.cardArea}>
          <Animated.View
            style={[styles.bigCard, { opacity: cardOpacity, transform: [{ scale: cardScale }], shadowColor: card.color }]}
            accessible={true}
            accessibilityLabel={`${card.title}. ${card.tip}`}
          >
            <View style={[styles.emojiCircle, { backgroundColor: card.color + '12' }]}>
              <Text style={styles.bigEmoji}>{card.emoji}</Text>
            </View>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <View style={[styles.tipBadge, { backgroundColor: card.color + '12' }]}>
              <Text style={[styles.tipText, { color: card.color }]}>{card.tip}</Text>
            </View>
            <TouchCard
              style={[styles.voiceButton, { backgroundColor: card.color }]}
              onPress={handleSpeak}
              accessibilityLabel={`Hear about ${card.title}`}
              accessibilityHint="Reads the social skill description aloud"
            >
              <Text style={styles.voiceButtonText}>🔊  Hear It</Text>
            </TouchCard>
          </Animated.View>
        </View>

        {/* ── Navigation ── */}
        <View style={styles.navRow}>
          <TouchCard
            style={styles.navBtn}
            onPress={handlePrev}
            accessibilityLabel="Previous card"
            accessibilityHint="Go to the previous social skill"
          >
            <Text style={styles.navBtnText}>← Back</Text>
          </TouchCard>

          {/* Grouped dot indicators (max 7 visible) */}
          <View style={styles.dots} accessibilityLabel={`Card ${currentIndex + 1} of ${SOCIAL_CARDS.length}`}>
            {dotStart > 0 && <View style={styles.dotEllipsis}><Text style={styles.dotEllipsisText}>…</Text></View>}
            {visibleDots.map((_, i) => {
              const actualIndex = dotStart + i;
              return (
                <View key={actualIndex} style={[
                  styles.dot,
                  actualIndex === currentIndex && { backgroundColor: card.color, width: 20 },
                ]} />
              );
            })}
            {dotEnd < SOCIAL_CARDS.length && <View style={styles.dotEllipsis}><Text style={styles.dotEllipsisText}>…</Text></View>}
          </View>

          <TouchCard
            style={[styles.navBtn, styles.nextBtn, { backgroundColor: card.color }]}
            onPress={handleNext}
            accessibilityLabel={currentIndex < SOCIAL_CARDS.length - 1 ? 'Next card' : 'Start over'}
            accessibilityHint={currentIndex < SOCIAL_CARDS.length - 1 ? 'Go to the next social skill' : 'Restart from the first card'}
          >
            <Text style={[styles.navBtnText, { color: COLORS.textOnDark }]}>
              {currentIndex < SOCIAL_CARDS.length - 1 ? 'Next →' : 'Start Over ↻'}
            </Text>
          </TouchCard>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1 },
  waveContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0 },

  // Header
  headerTop: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.xl, marginTop: SPACING.base, zIndex: 10,
  },
  backButton: {
    backgroundColor: COLORS.overlayWhite95, borderRadius: RADII.lg,
    width: 44, height: 44, justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.lg, shadowColor: COLORS.primaryDeep, shadowOpacity: 0.15,
  },
  headerTitles: { flex: 1, alignItems: 'center', marginRight: 44 },
  title: {
    fontSize: FONT_SIZES.largeTitle, fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textOnDark, letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
  },
  subtitleText: {
    fontSize: FONT_SIZES.footnote, color: 'rgba(255,255,255,0.85)',
    fontWeight: FONT_WEIGHTS.semibold, marginTop: 3, letterSpacing: 0.8, textTransform: 'uppercase',
  },

  // Progress
  progressOuter: {
    height: 5, backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: SPACING.xl, marginTop: SPACING.body, borderRadius: 3, overflow: 'hidden',
  },
  progressInner: { height: '100%', borderRadius: 3 },

  // Card area
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.xl },
  bigCard: {
    backgroundColor: COLORS.surface, borderRadius: RADII.xxl + 8, padding: SPACING.xxl + 4,
    alignItems: 'center', width: '100%',
    shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 16,
  },
  emojiCircle: {
    width: 140, height: 140, borderRadius: 70,
    justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg,
  },
  bigEmoji: { fontSize: 80 },
  cardTitle: {
    fontSize: FONT_SIZES.superDisplay - 4, fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textPrimary, letterSpacing: -0.5, marginBottom: SPACING.body, textAlign: 'center',
  },
  tipBadge: {
    borderRadius: RADII.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 2, marginBottom: SPACING.xl,
  },
  tipText: { fontSize: FONT_SIZES.callout, fontWeight: FONT_WEIGHTS.bold, textAlign: 'center' },
  voiceButton: {
    borderRadius: RADII.xl - 2, paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.base,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 8,
  },
  voiceButtonText: { color: COLORS.textOnDark, fontSize: FONT_SIZES.title3 + 1, fontWeight: FONT_WEIGHTS.extrabold },

  // Navigation
  navRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingBottom: 30, paddingTop: SPACING.base,
  },
  navBtn: {
    backgroundColor: COLORS.surface, borderRadius: RADII.lg - 2,
    paddingHorizontal: SPACING.xl - 2, paddingVertical: SPACING.body,
    ...SHADOWS.sm,
  },
  nextBtn: {
    ...SHADOWS.md, shadowOpacity: 0.2,
  },
  navBtnText: { fontSize: FONT_SIZES.callout, fontWeight: FONT_WEIGHTS.extrabold, color: '#334155' },

  // Dots (grouped)
  dots: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#CBD5E1', marginHorizontal: 3,
  },
  dotEllipsis: { marginHorizontal: 2 },
  dotEllipsisText: { fontSize: FONT_SIZES.footnote, color: '#CBD5E1', fontWeight: FONT_WEIGHTS.bold },
});

export default SocialSkillsSuite;
