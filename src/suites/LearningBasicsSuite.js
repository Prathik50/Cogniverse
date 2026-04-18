/**
 * LearningBasicsSuite — Full UI Overhaul
 * ========================================
 * Features the new ModuleRow list with progress indicators,
 * a clean SVG edge header, and a bounce-animated FAB.
 * Flashcard logic has been perfectly preserved and modularized into decoupled thin wrappers.
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
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import HelpModal from '../screens/HelpModal';
import { BackArrowIcon, HelpIcon } from '../components/icons/ConditionIcons';
import ModuleRow from '../components/ModuleRow';
import { COLORS, SPACING, RADII, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../theme';

// Screen Routing
import NumbersScreen from '../screens/NumbersScreen';
import ColorsScreen from '../screens/ColorsScreen';
import AlphabetScreen from '../screens/AlphabetScreen';
import DailyRoutinesScreen from '../screens/DailyRoutinesScreen';

const { width } = Dimensions.get('window');

const FloatingOrb = ({ size, color, top, left, delay = 0 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 1000, delay, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000 + delay, useNativeDriver: true }),
      ])
    ).start();
  }, [delay, floatAnim, opacityAnim]);

  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  return (
    <Animated.View
      style={{
        position: 'absolute', top, left, width: size, height: size,
        borderRadius: size / 2, backgroundColor: color,
        opacity: opacityAnim, transform: [{ translateY }],
      }}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden={true}
    />
  );
};

// ── Data Configs ──
const ACTIVITIES = [
  { id: 'numbers', title: 'Numbers', description: 'Explore numbers 1 to 20 with interactive flashcards.', icon: '🔢', color: '#3B82F6', progress: 100 }, // Blue
  { id: 'colors', title: 'Colors', description: 'Discover colors through vibrant, immersive displays.', icon: '🎨', color: '#EC4899', progress: 40 }, // Pink
  { id: 'alphabet', title: 'Alphabet', description: 'Learn each letter with matching pictures and sounds.', icon: '🔤', color: '#14B8A6', progress: 15 }, // Teal
  { id: 'daily-routines', title: 'Daily Routines', description: 'Practice morning and night routines step-by-step.', icon: '☀️', color: '#F59E0B', progress: 80 }, // Orange
];

const LearningBasicsSuite = ({ onBack }) => {
  const { t } = useLanguage();
  const { speak } = useTTS();
  
  const [currentScreen, setCurrentScreen] = useState('main');
  const [showHelp, setShowHelp] = useState(false);

  // ── Animations ──
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const listFade = useRef(new Animated.Value(0)).current;
  const listSlide = useRef(new Animated.Value(40)).current;
  const fabBounce = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
      Animated.timing(listFade, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.spring(listSlide, { toValue: 0, tension: 50, friction: 8, delay: 200, useNativeDriver: true }),
      Animated.spring(fabBounce, { toValue: 0, tension: 50, friction: 5, delay: 600, useNativeDriver: true }),
    ]).start();
  }, [headerFade, headerSlide, listFade, listSlide, fabBounce]);

  const handleActivityPress = (activityId, title) => {
    speak(title);
    setCurrentScreen(activityId);
  };

  const handleBackToMain = () => {
    speak('Going back to Learning Basics menu');
    setCurrentScreen('main');
  };

  const handleHelpPress = () => { speak(t('openingHelpForSuite')); setShowHelp(true); };

  // ── Moduler Routed Rendering ──
  if (currentScreen === 'numbers') return <NumbersScreen onBack={handleBackToMain} />;
  if (currentScreen === 'colors') return <ColorsScreen onBack={handleBackToMain} />;
  if (currentScreen === 'alphabet') return <AlphabetScreen onBack={handleBackToMain} />;
  if (currentScreen === 'daily-routines') return <DailyRoutinesScreen onBack={handleBackToMain} />;


  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.greenBg} />
        <SafeAreaView>
          <Animated.View style={[styles.headerTop, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8} accessibilityLabel="Go back">
              <BackArrowIcon size={20} color={COLORS.textOnDark} />
            </TouchableOpacity>
            <View style={styles.headerTitles}>
              <Text style={styles.title}>Learning Basics</Text>
              <Text style={styles.subtitle}>Start Learning</Text>
            </View>
            <View style={{ width: 44 }} />
          </Animated.View>
        </SafeAreaView>

        <View style={styles.cleanEdgeSvg}>
          <Svg width="100%" height="40" viewBox="0 0 1440 40" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="greenEdge" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#064E3B" />
                <Stop offset="50%" stopColor="#059669" />
                <Stop offset="100%" stopColor="#10B981" />
              </LinearGradient>
            </Defs>
            <Path fill="url(#greenEdge)" d="M0,0 L0,20 Q720,40 1440,20 L1440,0 Z" />
          </Svg>
        </View>

        <FloatingOrb size={80} color="rgba(255,255,255,0.08)" top={20} left={width - 100} delay={0} />
        <FloatingOrb size={50} color="rgba(255,255,255,0.05)" top={80} left={30} delay={400} />
      </View>

      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={{ opacity: listFade, transform: [{ translateY: listSlide }] }}
      >
        <Text style={styles.listSectionHeader}>Choose a topic to explore:</Text>

        <View style={styles.modulesContainer}>
          {ACTIVITIES.map((activity, index) => (
            <ModuleRow
              key={activity.id}
              title={activity.title}
              description={activity.description}
              icon={activity.icon}
              accentColor={activity.color}
              progress={activity.progress}
              onPress={() => handleActivityPress(activity.id, activity.title)}
              isLast={index === ACTIVITIES.length - 1}
            />
          ))}
        </View>
      </Animated.ScrollView>

      <Animated.View style={[styles.fabContainer, { transform: [{ translateY: fabBounce }] }]}>
        <TouchableOpacity style={styles.helpFab} onPress={handleHelpPress} activeOpacity={0.85}>
          <HelpIcon size={30} color={COLORS.textOnDark} />
        </TouchableOpacity>
      </Animated.View>

      <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} context="learning-basics" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerSection: { zIndex: 10 },
  greenBg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#059669' },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, paddingTop: 16 },
  backButton: { width: 44, height: 44, borderRadius: RADII.md, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  headerTitles: { flex: 1, alignItems: 'center' },
  title: { fontSize: FONT_SIZES.title2, fontWeight: FONT_WEIGHTS.black, color: COLORS.textOnDark, letterSpacing: -0.2 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: FONT_WEIGHTS.semibold, marginTop: 2, letterSpacing: 0.5, textTransform: 'uppercase' },
  cleanEdgeSvg: { height: 40, marginTop: -1 },
  scrollContent: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: 120 },
  listSectionHeader: { fontSize: FONT_SIZES.body, color: COLORS.textSecondary, fontWeight: FONT_WEIGHTS.bold, marginBottom: SPACING.lg, marginLeft: SPACING.xs },
  modulesContainer: { backgroundColor: COLORS.surface, borderRadius: RADII.xl, paddingVertical: SPACING.sm, ...SHADOWS.md, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 15, borderWidth: 1, borderColor: COLORS.borderLight },
  fabContainer: { position: 'absolute', bottom: 35, right: SPACING.xl },
  helpFab: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#059669', justifyContent: 'center', alignItems: 'center', ...SHADOWS.colored('#059669'), shadowOpacity: 0.4 },
});

export default LearningBasicsSuite;
