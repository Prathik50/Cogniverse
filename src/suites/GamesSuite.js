/**
 * GamesSuite — Therapeutic Games Hub
 * ====================================
 * Lists all 4 therapeutic games with premium card UI.
 *
 * Changes: theme tokens, a11y props, BackHandler.
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
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import HelpModal from '../screens/HelpModal';
import { BackArrowIcon, HelpIcon } from '../components/icons/ConditionIcons';
import MatchPairsGame from '../screens/games/MatchPairsGame';
import EmotionDetectiveGame from '../screens/games/EmotionDetectiveGame';
import CountAndTapGame from '../screens/games/CountAndTapGame';
import PatternPuzzleGame from '../screens/games/PatternPuzzleGame';
import { COLORS, SPACING, RADII, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

// ── Decorative orb ──
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

const GAMES = [
  { id: 'match-pairs', title: 'Match Pairs', description: 'Find matching pairs to train memory and concentration.', emoji: '🧠', color: '#8B5CF6', benefit: 'Memory & Focus' },
  { id: 'emotion-detective', title: 'Emotion Detective', description: 'Identify emotions from faces to build social awareness.', emoji: '🕵️', color: '#EC4899', benefit: 'Emotional Intelligence' },
  { id: 'count-and-tap', title: 'Count & Tap', description: 'Count objects on screen and choose the right number.', emoji: '🎯', color: '#06B6D4', benefit: 'Numeracy Skills' },
  { id: 'pattern-puzzle', title: 'Pattern Puzzle', description: 'Complete visual patterns to boost logical thinking.', emoji: '🧩', color: '#D946EF', benefit: 'Pattern Recognition' },
];

const GamesSuite = ({ onBack }) => {
  const { t } = useLanguage();
  const { speak } = useTTS();
  const [currentGame, setCurrentGame] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const cardAnims = useRef(GAMES.map(() => ({ fade: new Animated.Value(0), slide: new Animated.Value(60), scale: new Animated.Value(0.92) }))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();
    cardAnims.forEach((anim, i) => {
      const delay = 200 + i * 120;
      Animated.parallel([
        Animated.timing(anim.fade, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
        Animated.spring(anim.slide, { toValue: 0, tension: 50, friction: 8, delay, useNativeDriver: true }),
        Animated.spring(anim.scale, { toValue: 1, tension: 50, friction: 7, delay, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  // ── Android back ──
  useEffect(() => {
    const onHardwareBack = () => {
      if (showHelp) { setShowHelp(false); return true; }
      if (currentGame) { setCurrentGame(null); return true; }
      onBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBack);
  }, [currentGame, showHelp, onBack]);

  const handleGamePress = (gameId) => {
    const game = GAMES.find(g => g.id === gameId);
    speak(`Opening ${game.title}. ${game.description}`);
    setCurrentGame(gameId);
  };

  const handleBackToMenu = () => setCurrentGame(null);

  if (currentGame === 'match-pairs') return <MatchPairsGame onBack={handleBackToMenu} />;
  if (currentGame === 'emotion-detective') return <EmotionDetectiveGame onBack={handleBackToMenu} />;
  if (currentGame === 'count-and-tap') return <CountAndTapGame onBack={handleBackToMenu} />;
  if (currentGame === 'pattern-puzzle') return <PatternPuzzleGame onBack={handleBackToMenu} />;

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={520} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="gamesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primaryDeep} />
              <Stop offset="30%" stopColor="#5B21B6" />
              <Stop offset="60%" stopColor="#7C3AED" />
              <Stop offset="100%" stopColor="#A78BFA" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#gamesGrad)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <FloatingOrb size={75} color="rgba(139,92,246,0.12)" top={60} left={width - 95} delay={0} />
      <FloatingOrb size={50} color="rgba(167,139,250,0.14)" top={130} left={25} delay={300} />
      <FloatingOrb size={35} color="rgba(217,70,239,0.12)" top={100} left={width / 2 - 10} delay={500} />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.headerTop, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            accessibilityHint="Returns to Learning Center"
          >
            <BackArrowIcon size={22} color="#7C3AED" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title} accessibilityRole="header">Fun & Games</Text>
            <Text style={styles.subtitle}>Therapeutic Play</Text>
          </View>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.heroBanner, { opacity: headerFade }]}>
            <Text style={styles.heroTitle}>Play & Learn</Text>
            <Text style={styles.heroSubtitle}>Fun games designed to build memory, emotions, counting, and pattern skills.</Text>
          </Animated.View>

          {GAMES.map((game, index) => (
            <Animated.View key={game.id} style={{ opacity: cardAnims[index].fade, transform: [{ translateY: cardAnims[index].slide }, { scale: cardAnims[index].scale }] }}>
              <TouchableOpacity
                style={styles.gameCard}
                onPress={() => handleGamePress(game.id)}
                activeOpacity={0.85}
                accessibilityLabel={`${game.title} — ${game.benefit}`}
                accessibilityRole="button"
                accessibilityHint={game.description}
              >
                <View style={[styles.cardAccentStrip, { backgroundColor: game.color }]} />
                <View style={styles.cardInner}>
                  <View style={[styles.gameIconBox, { backgroundColor: game.color + '15' }]}>
                    <View style={[styles.iconGlow, { backgroundColor: game.color + '20' }]}>
                      <Text style={styles.gameEmoji}>{game.emoji}</Text>
                    </View>
                  </View>
                  <View style={styles.gameContent}>
                    <View style={styles.gameTitleRow}>
                      <Text style={styles.gameTitle}>{game.title}</Text>
                      <View style={[styles.benefitBadge, { backgroundColor: game.color + '18' }]}>
                        <Text style={[styles.benefitText, { color: game.color }]}>{game.benefit}</Text>
                      </View>
                    </View>
                    <Text style={styles.gameDescription}>{game.description}</Text>
                  </View>
                  <View style={[styles.arrowContainer, { backgroundColor: game.color + '12' }]}>
                    <Text style={[styles.arrowText, { color: game.color }]}>→</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          <Animated.View style={{ opacity: headerFade }}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>🌟 Why These Games?</Text>
              <Text style={styles.infoText}>Each game is carefully designed by child development experts to target specific skills that help children with autism and Down syndrome grow through play. Sessions are tracked to monitor progress.</Text>
            </View>
          </Animated.View>
        </ScrollView>

        <TouchableOpacity
          style={styles.helpFab}
          onPress={() => { speak('Opening help'); setShowHelp(true); }}
          activeOpacity={0.85}
          accessibilityLabel="Help"
          accessibilityRole="button"
          accessibilityHint="Opens the help guide for games"
        >
          <View style={styles.helpFabInner}>
            <HelpIcon size={28} color={COLORS.textOnDark} />
          </View>
        </TouchableOpacity>

        <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} context="games" />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1 },
  waveContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0 },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.xl, marginTop: SPACING.base, zIndex: 10 },
  backButton: {
    backgroundColor: COLORS.overlayWhite95, borderRadius: RADII.lg, width: 44, height: 44,
    justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.lg, shadowColor: COLORS.primaryDeep, shadowOpacity: 0.15,
  },
  headerTitles: { flex: 1, alignItems: 'center', marginRight: 44 },
  title: { fontSize: FONT_SIZES.largeTitle + 2, fontWeight: FONT_WEIGHTS.black, color: COLORS.textOnDark, letterSpacing: 0.3, textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  subtitle: { fontSize: FONT_SIZES.footnote, color: 'rgba(224,231,255,0.9)', fontWeight: FONT_WEIGHTS.semibold, marginTop: 3, letterSpacing: 1, textTransform: 'uppercase' },
  scrollContent: { paddingTop: SPACING.xl, paddingHorizontal: SPACING.lg, paddingBottom: 100 },
  heroBanner: { marginBottom: SPACING.xxl - 4, paddingHorizontal: SPACING.xs },
  heroTitle: { fontSize: FONT_SIZES.superDisplay - 4, fontWeight: FONT_WEIGHTS.black, color: COLORS.textOnDark, letterSpacing: -0.5, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  heroSubtitle: { fontSize: FONT_SIZES.callout, color: 'rgba(255,255,255,0.85)', fontWeight: FONT_WEIGHTS.medium, marginTop: SPACING.sm, lineHeight: 22 },

  gameCard: { backgroundColor: COLORS.surface, borderRadius: RADII.xl, marginBottom: SPACING.lg - 2, ...SHADOWS.lg, overflow: 'hidden' },
  cardAccentStrip: { height: 4, borderTopLeftRadius: RADII.xl, borderTopRightRadius: RADII.xl },
  cardInner: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, paddingTop: SPACING.lg - 2 },
  gameIconBox: { width: 64, height: 64, borderRadius: RADII.lg, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.base },
  iconGlow: { width: 52, height: 52, borderRadius: RADII.md, justifyContent: 'center', alignItems: 'center' },
  gameEmoji: { fontSize: 28 },
  gameContent: { flex: 1, paddingRight: SPACING.xs },
  gameTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: SPACING.sm - 2 },
  gameTitle: { fontSize: FONT_SIZES.title3, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.textPrimary, letterSpacing: -0.2, marginRight: SPACING.sm },
  benefitBadge: { paddingHorizontal: SPACING.sm + 2, paddingVertical: 3, borderRadius: RADII.sm + 2 },
  benefitText: { fontSize: 10, fontWeight: FONT_WEIGHTS.bold, letterSpacing: 0.2 },
  gameDescription: { fontSize: FONT_SIZES.small, color: COLORS.textSecondary, lineHeight: 20, fontWeight: FONT_WEIGHTS.medium },
  arrowContainer: { width: 36, height: 36, borderRadius: RADII.sm + 2, justifyContent: 'center', alignItems: 'center' },
  arrowText: { fontSize: FONT_SIZES.title2, fontWeight: FONT_WEIGHTS.black },

  infoCard: { backgroundColor: 'rgba(139,92,246,0.06)', borderRadius: RADII.lg, padding: SPACING.xl, borderWidth: 1, borderColor: 'rgba(139,92,246,0.12)', marginTop: SPACING.sm },
  infoTitle: { fontSize: FONT_SIZES.headline, fontWeight: FONT_WEIGHTS.extrabold, color: '#5B21B6', marginBottom: SPACING.sm + 2 },
  infoText: { fontSize: FONT_SIZES.body, color: COLORS.textSecondary, lineHeight: 22, fontWeight: FONT_WEIGHTS.medium },

  helpFab: { position: 'absolute', bottom: 30, right: SPACING.xl, ...SHADOWS.glow('#7C3AED') },
  helpFabInner: { width: 60, height: 60, borderRadius: RADII.lg, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' },
});

export default GamesSuite;
