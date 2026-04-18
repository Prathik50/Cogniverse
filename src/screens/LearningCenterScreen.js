/**
 * LearningCenterScreen — Therapy Suites (Swipeable Card Stack)
 * =============================================================
 *
 * Layout (top to bottom — NO absolute positioning on cards):
 *
 *   ┌─────────────────────────────────────────┐
 *   │  PURPLE HEADER (SVG bg, max 120px)      │
 *   │  ← Back    "Therapy Suites"     spacer  │
 *   │           SWIPE TO BROWSE               │
 *   │           ● ● ● ●  (dots)              │
 *   ├─────────────── wave curve ──────────────┤
 *   │                                         │
 *   │        WHITE AREA (flex: 1)             │
 *   │     ┌──────────────────────────┐        │
 *   │     │  [icon 80x80]           │        │
 *   │     │  Suite Name (28px)      │        │
 *   │     │  ● 4 modules (badge)    │        │
 *   │     │  Description text...    │        │
 *   │     │  [Explore Suite →]      │        │
 *   │     └──────────────────────────┘        │
 *   │                                         │
 *   │     ← Swipe to explore suites →         │
 *   └─────────────────────────────────────────┘
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';

// Suite screens
import CommunicationToolsScreen from './CommunicationToolsScreen';
import SocialSkillsCardScreen from './SocialSkillsCardScreen';
import LearningBasicsSuite from '../suites/LearningBasicsSuite';
import FunAndGamesScreen from './FunAndGamesScreen';

// Components
import SuiteCard from '../components/SuiteCard';
import {
  BackArrowIcon,
  CommunicationIcon,
  LearningIcon,
  SocialIcon,
  GamesIcon,
} from '../components/icons/ConditionIcons';

const { width: SW } = Dimensions.get('window');
const SWIPE_THRESHOLD = SW * 0.28;

// ═══════════════════════════════════════════════
// SUITE DATA — each has its own accent color
// ═══════════════════════════════════════════════
const SUITES = [
  {
    id: 'autismCommunication',
    title: 'Autism &\nCommunication',
    description:
      'Expressive language tools to build conversation and sentence structure through visual aids.',
    moduleCount: 3,
    IconComponent: CommunicationIcon,
    accentColor: '#4B3FD8',
  },
  {
    id: 'learningBasics',
    title: 'Learning Basics',
    description:
      'Interactive flashcards covering daily routines, reading, math, and essential life skills.',
    moduleCount: 4,
    IconComponent: LearningIcon,
    accentColor: '#38B2AC',
  },
  {
    id: 'socialSkills',
    title: 'Social Skills',
    description:
      'Focused single-view cards teaching critical real-world social cues and interpersonal skills.',
    moduleCount: 12,
    IconComponent: SocialIcon,
    accentColor: '#F6A623',
  },
  {
    id: 'games',
    title: 'Fun & Games',
    description:
      'Gamified cognitive therapy including pattern puzzles, memory challenges, and emotion quizzes.',
    moduleCount: 4,
    IconComponent: GamesIcon,
    accentColor: '#E91E8C',
  },
];

// ═══════════════════════════════════════════════
// PROGRESS DOTS
// ═══════════════════════════════════════════════
const ProgressDots = ({ total, active }) => (
  <View style={dotStyles.row}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={[
          dotStyles.dot,
          i === active && dotStyles.dotActive,
          i === active && {
            backgroundColor: SUITES[active]?.accentColor || '#4B3FD8',
          },
        ]}
      />
    ))}
  </View>
);

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginHorizontal: 5,
  },
  dotActive: {
    width: 26,
    height: 8,
    borderRadius: 4,
  },
});

// ═══════════════════════════════════════════════
// SWIPEABLE CARD WRAPPER (PanResponder + Animated)
// ═══════════════════════════════════════════════
const SwipeableCard = ({ suite, onSwipedAway, onPress }) => {
  const panX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderGrant: () => {
        panX.setValue(0);
      },
      onPanResponderMove: (_, gs) => {
        panX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        const dismiss =
          Math.abs(gs.dx) > SWIPE_THRESHOLD ||
          Math.abs(gs.vx) > 0.8;

        if (dismiss) {
          const dir = gs.dx > 0 ? 1 : -1;
          Animated.timing(panX, {
            toValue: dir * SW * 1.5,
            duration: 280,
            useNativeDriver: true,
          }).start(() => {
            panX.setValue(0);
            onSwipedAway();
          });
        } else {
          Animated.spring(panX, {
            toValue: 0,
            friction: 6,
            tension: 120,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const rotate = panX.interpolate({
    inputRange: [-SW, 0, SW],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.swipeWrapper,
        {
          transform: [{ translateX: panX }, { rotate }],
        },
      ]}
    >
      <SuiteCard
        title={suite.title}
        description={suite.description}
        moduleCount={suite.moduleCount}
        IconComponent={suite.IconComponent}
        accentColor={suite.accentColor}
        onPress={() => onPress(suite.id)}
      />
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════
const LearningCenterScreen = ({ onBack }) => {
  const { t } = useLanguage();
  const { speak } = useTTS();
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentSuite, setCurrentSuite] = useState(null);

  // Android back
  useEffect(() => {
    const handler = () => {
      if (currentSuite) { setCurrentSuite(null); return true; }
      onBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handler);
    return () => BackHandler.removeEventListener('hardwareBackPress', handler);
  }, [currentSuite, onBack]);

  const handleSwiped = useCallback(() => {
    const next = (activeIndex + 1) % SUITES.length;
    setActiveIndex(next);
    speak(SUITES[next].title.replace('\n', ' '));
  }, [activeIndex, speak]);

  const handleSuitePress = useCallback(
    (suiteId) => {
      const s = SUITES.find((x) => x.id === suiteId);
      speak(`Opening ${s.title.replace('\n', ' ')}`);
      setCurrentSuite(suiteId);
    },
    [speak],
  );

  // Suite routing
  if (currentSuite === 'autismCommunication') return <CommunicationToolsScreen onBack={() => setCurrentSuite(null)} />;
  if (currentSuite === 'learningBasics') return <LearningBasicsSuite onBack={() => setCurrentSuite(null)} />;
  if (currentSuite === 'socialSkills') return <SocialSkillsCardScreen onBack={() => setCurrentSuite(null)} />;
  if (currentSuite === 'games') return <FunAndGamesScreen onBack={() => setCurrentSuite(null)} />;

  return (
    <View style={styles.screen}>
      {/* ═══════════════════════════════════
          SECTION 1: PURPLE HEADER + WAVE
          Fixed height, not flex
      ═══════════════════════════════════ */}
      <View style={styles.headerSection}>
        {/* Solid purple bg behind header content */}
        <View style={styles.purpleBg} />

        <SafeAreaView>
          {/* Top row: back + title + spacer */}
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBack}
              activeOpacity={0.8}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <BackArrowIcon size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.titleGroup}>
              <Text style={styles.screenTitle} accessibilityRole="header">
                Therapy Suites
              </Text>
              <Text style={styles.screenSubtitle}>SWIPE TO BROWSE</Text>
            </View>

            <View style={{ width: 44 }} />
          </View>

          {/* Dots */}
          <ProgressDots total={SUITES.length} active={activeIndex} />
        </SafeAreaView>

        {/* SVG wave transition — exactly 60px tall */}
        <View style={styles.waveBar}>
          <Svg
            width="100%"
            height="60"
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
          >
            <Path
              fill="#4B3FD8"
              d="M0,0 L0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,0 Z"
            />
          </Svg>
        </View>
      </View>

      {/* ═══════════════════════════════════
          SECTION 2: WHITE CARD AREA
          flex: 1, card vertically centered
      ═══════════════════════════════════ */}
      <View style={styles.whiteArea}>
        <View style={styles.cardCentered}>
          <SwipeableCard
            key={`card-${activeIndex}`}
            suite={SUITES[activeIndex]}
            onSwipedAway={handleSwiped}
            onPress={handleSuitePress}
          />
        </View>

        {/* Bottom hint */}
        <Text style={styles.hintText}>← Swipe to explore suites →</Text>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════
// STYLES — no absolute positioning on cards
// ═══════════════════════════════════════════════
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // ── HEADER SECTION (fixed height) ──
  headerSection: {
    // No flex — height is intrinsic from its children
    zIndex: 2,
  },
  purpleBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4B3FD8',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  titleGroup: {
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  screenSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.8,
    marginTop: 3,
  },

  // Wave bar sits right below the header content
  waveBar: {
    height: 60,
    marginTop: -1, // eliminate hairline gap
  },

  // ── WHITE CARD AREA (flex: 1) ──
  whiteArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
  },
  cardCentered: {
    flex: 1,
    justifyContent: 'center',
  },
  swipeWrapper: {
    // No position: absolute — normal flex flow
    width: '100%',
  },
  hintText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    paddingTop: 8,
  },
});

export default LearningCenterScreen;
