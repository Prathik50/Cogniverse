/**
 * HubScreen — Home Dashboard  (v3 – Full Overhaul)
 * ==================================================
 *
 * 1. Progress card → clean layered card with solid purple header band
 * 2. Stats → pop with large 36px numbers + colored label badges
 * 3. Daily Goal → animated fill on mount via AnimatedProgressBar
 * 4. Explore Universe → horizontal ScrollView with peek of next card
 * 5. Menu button → proper SideDrawer (swipeable, spring-animated)
 *
 * Sub-components used:
 *   - ../components/SideDrawer.js
 *   - ../components/AnimatedProgressBar.js
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  BackHandler,
  Platform,
  StatusBar,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';

// ── Screens ──
import SettingsScreen from './SettingsScreen';
import ChildDashboardScreen from './ChildDashboardScreen';
import ConditionsGuideScreen from './ConditionsGuideScreen';
import ChatbotScreen from './ChatbotScreen';
import LearningCenterScreen from './LearningCenterScreen';
import AboutScreen from './AboutScreen';
import OfflinePrintablesScreen from './OfflinePrintablesScreen';

// ── Components ──
import SideDrawer from '../components/SideDrawer';
import AnimatedProgressBar from '../components/AnimatedProgressBar';

import {
  MenuIcon,
  ChatbotIcon,
  LearningIcon,
  HelpIcon,
  SocialIcon,
} from '../components/icons/ConditionIcons';

import {
  COLORS,
  SPACING,
  RADII,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
} from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');
const EXPLORE_CARD_W = SCREEN_W * 0.72;
const EXPLORE_CARD_GAP = 14;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// ════════════════════════════════════════════════
// REUSABLE: Scale-on-press wrapper
// ════════════════════════════════════════════════
const TouchCard = ({
  children,
  onPress,
  style,
  disabled,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <AnimatedTouchable
      style={[style, { transform: [{ scale }] }]}
      activeOpacity={0.92}
      onPressIn={() =>
        !disabled &&
        Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()
      }
      onPressOut={() =>
        !disabled &&
        Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()
      }
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
    >
      {children}
    </AnimatedTouchable>
  );
};

// ════════════════════════════════════════════════
// FLOATING ORB (decorative, hidden from a11y)
// ════════════════════════════════════════════════
const FloatingOrb = ({ size, color, top, right, left, delay = 0 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacAnim, { toValue: 1, duration: 1200, delay, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 4500 + delay, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 4500 + delay, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const ty = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  return (
    <Animated.View
      style={{
        position: 'absolute', top, left, right, width: size, height: size,
        borderRadius: size / 2, backgroundColor: color,
        opacity: opacAnim, transform: [{ translateY: ty }],
      }}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    />
  );
};

// ════════════════════════════════════════════════
// STAT PILL — single statistic with colored label
// ════════════════════════════════════════════════
const StatPill = ({ value, label, color, emoji }) => (
  <View style={statStyles.container}>
    <Text style={[statStyles.value, { color }]}>
      {emoji ? `${emoji} ` : ''}{value}
    </Text>
    <View style={[statStyles.badge, { backgroundColor: color + '14' }]}>
      <Text style={[statStyles.label, { color }]}>{label}</Text>
    </View>
  </View>
);

const statStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 36,
    fontWeight: FONT_WEIGHTS.black,
    letterSpacing: -1,
    marginBottom: 6,
    lineHeight: 40,
  },
  badge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADII.sm,
  },
  label: {
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.extrabold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});

// ════════════════════════════════════════════════
// EXPLORE CARD — horizontal scroll item
// ════════════════════════════════════════════════
const ExploreCard = ({ title, subtitle, color, IconComponent, onPress, index, scrollX }) => {
  // Parallax scale effect driven by scrollX
  const inputRange = [
    (index - 1) * (EXPLORE_CARD_W + EXPLORE_CARD_GAP),
    index * (EXPLORE_CARD_W + EXPLORE_CARD_GAP),
    (index + 1) * (EXPLORE_CARD_W + EXPLORE_CARD_GAP),
  ];
  const cardScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.92, 1, 0.92],
    extrapolate: 'clamp',
  });
  const cardOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.7, 1, 0.7],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[exploreStyles.wrapper, { transform: [{ scale: cardScale }], opacity: cardOpacity }]}
    >
      <TouchCard
        style={exploreStyles.card}
        onPress={onPress}
        accessibilityLabel={title}
        accessibilityHint={subtitle}
      >
        {/* Accent top strip */}
        <View style={[exploreStyles.topStrip, { backgroundColor: color }]} />

        {/* Color wash overlay */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: color, opacity: 0.04, borderRadius: RADII.xxl }]} />

        <View style={exploreStyles.cardBody}>
          {/* Icon */}
          <View style={[exploreStyles.iconBox, { backgroundColor: color + '15' }]}>
            <View style={[exploreStyles.iconGlow, { backgroundColor: color + '20' }]}>
              <IconComponent size={36} color={color} />
            </View>
          </View>

          {/* Text */}
          <Text style={exploreStyles.title}>{title}</Text>
          <Text style={exploreStyles.subtitle}>{subtitle}</Text>
        </View>

        {/* CTA */}
        <View style={exploreStyles.cardFooter}>
          <View style={[exploreStyles.cta, { backgroundColor: color }]}>
            <Text style={exploreStyles.ctaText}>Open →</Text>
          </View>
        </View>
      </TouchCard>
    </Animated.View>
  );
};

const exploreStyles = StyleSheet.create({
  wrapper: {
    width: EXPLORE_CARD_W,
    marginRight: EXPLORE_CARD_GAP,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.lg,
    height: 260,
  },
  topStrip: {
    height: 5,
    width: '100%',
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  },
  iconBox: {
    width: 68,
    height: 68,
    borderRadius: RADII.xl - 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  iconGlow: {
    width: 52,
    height: 52,
    borderRadius: RADII.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.title2 + 1,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: SPACING.xs + 1,
  },
  subtitle: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  cardFooter: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  cta: {
    paddingVertical: SPACING.md,
    borderRadius: RADII.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  ctaText: {
    fontSize: FONT_SIZES.callout,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: COLORS.textOnDark,
    letterSpacing: 0.3,
  },
});

// ════════════════════════════════════════════════
// MAIN HUBSCREEN COMPONENT
// ════════════════════════════════════════════════
const HubScreen = () => {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  const { userData } = useUser();
  const [currentScreen, setCurrentScreen] = useState('hub');
  const [showDrawer, setShowDrawer] = useState(false);

  // ── Stats ──
  const stats = userData?.activityStats || {
    totalActivities: 0,
    totalMinutes: 0,
    streak: 0,
  };
  const dailyGoal = 5;
  const progressPercent = Math.min(
    (stats.totalActivities / dailyGoal) * 100,
    100
  );

  // ── Entrance animations ──
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(30)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(50)).current;
  const exploreFade = useRef(new Animated.Value(0)).current;
  const exploreSlide = useRef(new Animated.Value(40)).current;
  // Scroll X for explore horizontal scroll parallax
  const exploreScrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Header
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 45, friction: 8, useNativeDriver: true }),
    ]).start();

    // Progress card
    Animated.parallel([
      Animated.timing(cardFade, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.spring(cardSlide, { toValue: 0, tension: 50, friction: 8, delay: 200, useNativeDriver: true }),
    ]).start();

    // Explore section
    Animated.parallel([
      Animated.timing(exploreFade, { toValue: 1, duration: 600, delay: 450, useNativeDriver: true }),
      Animated.spring(exploreSlide, { toValue: 0, tension: 50, friction: 8, delay: 450, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Android hardware back ──
  useEffect(() => {
    const onHardwareBack = () => {
      if (showDrawer) { setShowDrawer(false); return true; }
      if (currentScreen !== 'hub') { setCurrentScreen('hub'); return true; }
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBack);
  }, [currentScreen, showDrawer]);

  // ── Nav helper ──
  const nav = (screen, speech) => {
    speak(speech);
    setCurrentScreen(screen);
  };

  const goHome = () => setCurrentScreen('hub');

  // ── Route to sub-screens ──
  if (currentScreen === 'learning-center') return <LearningCenterScreen onBack={goHome} />;
  if (currentScreen === 'settings') return <SettingsScreen onBack={goHome} />;
  if (currentScreen === 'dashboard') return <ChildDashboardScreen onBack={goHome} />;
  if (currentScreen === 'conditions') return <ConditionsGuideScreen onBack={goHome} />;
  if (currentScreen === 'chatbot') return <ChatbotScreen onBack={goHome} />;
  if (currentScreen === 'offline-printables') return <OfflinePrintablesScreen onBack={goHome} />;
  if (currentScreen === 'about') return <AboutScreen onBack={goHome} />;

  // ── Explore section data ──
  const EXPLORE_ITEMS = [
    {
      id: 'learning-center',
      title: 'Learning Center',
      subtitle: 'Therapy suites & foundational skills',
      color: COLORS.success,
      IconComponent: LearningIcon,
      onPress: () => nav('learning-center', 'Opening Learning Center'),
    },
    {
      id: 'chatbot',
      title: 'AI Companion',
      subtitle: 'Chat with CogniBot for guidance',
      color: COLORS.accent,
      IconComponent: ChatbotIcon,
      onPress: () => nav('chatbot', 'Opening AI Companion'),
    },
    {
      id: 'conditions',
      title: 'Conditions Guide',
      subtitle: 'Learn about neurodivergent conditions',
      color: COLORS.warning,
      IconComponent: HelpIcon,
      onPress: () => nav('conditions', 'Opening Conditions Guide'),
    },
    {
      id: 'printables',
      title: 'Offline Printables',
      subtitle: 'Downloadable learning materials',
      color: COLORS.primary,
      IconComponent: SocialIcon,
      onPress: () => nav('offline-printables', 'Opening Offline Printables'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* ═══ Background SVG Gradient ═══ */}
      <View style={styles.waveContainer}>
        <Svg
          height={520}
          width="100%"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
        >
          <Defs>
            <LinearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#312E81" />
              <Stop offset="40%" stopColor="#4338CA" />
              <Stop offset="80%" stopColor="#6366F1" />
              <Stop offset="100%" stopColor="#818CF8" />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#dashGrad)"
            d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,218.7C672,235,768,213,864,186.7C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </Svg>
      </View>

      {/* ═══ Decorative orbs ═══ */}
      <FloatingOrb size={130} color="rgba(255,255,255,0.04)" top={10} right={-40} delay={0} />
      <FloatingOrb size={55} color="rgba(255,255,255,0.06)" top={170} left={15} delay={500} />
      <FloatingOrb size={35} color="rgba(255,255,255,0.05)" top={90} left={SCREEN_W * 0.55} delay={300} />

      <SafeAreaView style={styles.safeArea}>
        {/* ═══ Top Navbar ═══ */}
        <Animated.View
          style={[
            styles.headerRow,
            { opacity: headerFade, transform: [{ translateY: headerSlide }] },
          ]}
        >
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowDrawer(true)}
            activeOpacity={0.8}
            accessibilityLabel="Open menu"
            accessibilityRole="button"
            accessibilityHint="Opens navigation drawer"
          >
            <MenuIcon size={22} color={COLORS.textOnDark} />
          </TouchableOpacity>

          <View style={styles.logoGroup}>
            <Text style={styles.logoMark}>✦</Text>
            <Text style={styles.logoText} accessibilityRole="header">
              CogniVerse
            </Text>
          </View>

          {/* Balance spacer */}
          <View style={{ width: 48 }} />
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ═══ Hero Welcome ═══ */}
          <Animated.View
            style={[
              styles.heroSection,
              { opacity: headerFade, transform: [{ translateY: headerSlide }] },
            ]}
          >
            <Text style={styles.heroGreeting} accessibilityRole="header">
              {t('welcomeBack') || 'Welcome Back!'}
            </Text>
            <Text style={styles.heroSubtitle}>
              Your daily journey to growth and connection.
            </Text>
          </Animated.View>

          {/* ═══ PROGRESS CARD — Clean Layered Design ═══ */}
          <Animated.View
            style={{
              opacity: cardFade,
              transform: [{ translateY: cardSlide }],
            }}
          >
            <TouchCard
              style={styles.progressCard}
              onPress={() => nav('dashboard', 'Opening Dashboard')}
              accessibilityLabel={`My Progress. ${stats.totalActivities} activities completed, ${stats.totalMinutes} minutes, ${stats.streak} day streak`}
              accessibilityHint="Opens the Analytics Dashboard"
            >
              {/* ── Purple header band (solid, no gradient) ── */}
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.progressTitle}>My Progress</Text>
                  <Text style={styles.progressSub}>
                    Analytics Dashboard
                  </Text>
                </View>
                <View style={styles.progressArrow}>
                  <Text style={styles.progressArrowText}>→</Text>
                </View>
              </View>

              {/* ── Stats Row ── */}
              <View style={styles.statsRow}>
                <StatPill
                  value={stats.totalActivities}
                  label="Completed"
                  color="#4F46E5"
                />
                <View style={styles.statDivider} />
                <StatPill
                  value={stats.totalMinutes}
                  label="Minutes"
                  color={COLORS.success}
                />
                <View style={styles.statDivider} />
                <StatPill
                  value={stats.streak}
                  label="Day Streak"
                  color={COLORS.warning}
                  emoji="🔥"
                />
              </View>

              {/* ── Animated Daily Goal ── */}
              <View style={styles.goalSection}>
                <View style={styles.goalLabelRow}>
                  <Text style={styles.goalLabel}>Daily Goal</Text>
                  <Text style={styles.goalFraction}>
                    {Math.min(stats.totalActivities, dailyGoal)}/{dailyGoal}
                  </Text>
                </View>
                <AnimatedProgressBar
                  percent={progressPercent}
                  height={10}
                  fillColor="#4F46E5"
                  trackColor={COLORS.border}
                  delay={800}
                  duration={1400}
                  borderRadius={5}
                />
              </View>
            </TouchCard>
          </Animated.View>

          {/* ═══ EXPLORE THE UNIVERSE — Horizontal Scroll ═══ */}
          <Animated.View
            style={{
              opacity: exploreFade,
              transform: [{ translateY: exploreSlide }],
            }}
          >
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader} accessibilityRole="header">
                Explore the Universe
              </Text>
              <Text style={styles.sectionHint}>Swipe →</Text>
            </View>

            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={EXPLORE_CARD_W + EXPLORE_CARD_GAP}
              snapToAlignment="start"
              contentContainerStyle={styles.exploreScroll}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: exploreScrollX } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
            >
              {EXPLORE_ITEMS.map((item, index) => (
                <ExploreCard
                  key={item.id}
                  {...item}
                  index={index}
                  scrollX={exploreScrollX}
                />
              ))}
              {/* End padding so last card can center */}
              <View style={{ width: SCREEN_W - EXPLORE_CARD_W - SPACING.xl }} />
            </Animated.ScrollView>
          </Animated.View>

          {/* ═══ Daily Tip Card ═══ */}
          <Animated.View style={{ opacity: exploreFade }}>
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>💡</Text>
              <View style={styles.tipTextBox}>
                <Text style={styles.tipTitle}>Daily Tip</Text>
                <Text style={styles.tipBody}>
                  Consistency matters more than intensity. Even 5 minutes of
                  focused practice makes a difference!
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* ═══ Side Drawer ═══ */}
        <SideDrawer
          visible={showDrawer}
          onClose={() => setShowDrawer(false)}
          onSettingsPress={() => nav('settings', 'Settings')}
          onAboutPress={() => nav('about', 'Opening About CogniVerse')}
          onDashboardPress={() => nav('dashboard', 'Opening Dashboard')}
        />
      </SafeAreaView>
    </View>
  );
};

// ════════════════════════════════════════════════
// STYLESHEET
// ════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  // ── Top navbar ──
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    marginTop: Platform.OS === 'ios' ? SPACING.sm : SPACING.base,
    zIndex: 10,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: RADII.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMark: {
    fontSize: FONT_SIZES.title2,
    color: '#C4B5FD',
    marginRight: SPACING.sm,
  },
  logoText: {
    fontSize: FONT_SIZES.title1,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textOnDark,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // ── Scroll ──
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.massive + 20,
  },

  // ── Hero ──
  heroSection: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  heroGreeting: {
    fontSize: FONT_SIZES.superDisplay,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textOnDark,
    letterSpacing: -0.8,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.callout,
    color: 'rgba(255,255,255,0.88)',
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: SPACING.sm - 2,
    letterSpacing: 0.1,
  },

  // ── Progress Card ──
  progressCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADII.xxl,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    ...SHADOWS.xl,
    shadowColor: '#312E81',
    shadowOpacity: 0.14,
    marginBottom: SPACING.xxl + 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  progressHeader: {
    backgroundColor: '#312E81',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: FONT_SIZES.title3,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textOnDark,
    letterSpacing: -0.2,
  },
  progressSub: {
    fontSize: FONT_SIZES.footnote,
    fontWeight: FONT_WEIGHTS.semibold,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  progressArrow: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  progressArrowText: {
    color: COLORS.textOnDark,
    fontSize: FONT_SIZES.title3,
    fontWeight: FONT_WEIGHTS.black,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 4,
    paddingBottom: SPACING.lg,
  },
  statDivider: {
    width: 1,
    height: 44,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.sm,
  },

  // ── Goal ──
  goalSection: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.background,
    padding: SPACING.base,
    borderRadius: RADII.md + 2,
  },
  goalLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm + 2,
  },
  goalLabel: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textSecondary,
  },
  goalFraction: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.black,
    color: '#4F46E5',
  },

  // ── Section Header ──
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.base,
  },
  sectionHeader: {
    fontSize: FONT_SIZES.title1,
    fontWeight: FONT_WEIGHTS.black,
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
  },
  sectionHint: {
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },

  // ── Explore Scroll ──
  exploreScroll: {
    paddingLeft: SPACING.xl,
    paddingRight: SPACING.sm,
    paddingBottom: SPACING.sm,
  },

  // ── Daily Tip ──
  tipCard: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    backgroundColor: '#EEF2FF',
    borderRadius: RADII.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  tipEmoji: {
    fontSize: 28,
    marginRight: SPACING.base,
    marginTop: 2,
  },
  tipTextBox: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONT_SIZES.subhead,
    fontWeight: FONT_WEIGHTS.extrabold,
    color: '#4338CA',
    marginBottom: SPACING.xs + 1,
  },
  tipBody: {
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
});

export default HubScreen;