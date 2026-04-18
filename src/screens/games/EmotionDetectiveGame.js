/**
 * EmotionDetectiveGame — Emotion Recognition Quiz
 * =================================================
 * 8-round quiz game where children identify emotions from emoji faces.
 *
 * Changes: theme tokens, a11y props, BackHandler, decorative elements hidden from a11y tree.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { useTTS } from '../../contexts/TTSContext';
import { useUser } from '../../contexts/UserContext';
import { BackArrowIcon } from '../../components/icons/ConditionIcons';
import { COLORS, SPACING, RADII, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../theme';

const { width } = Dimensions.get('window');

const ROUNDS = [
  { prompt: 'happy', promptEmoji: '😊', options: [{ emoji: '😊', label: 'Happy', isCorrect: true }, { emoji: '😢', label: 'Sad', isCorrect: false }, { emoji: '😠', label: 'Angry', isCorrect: false }, { emoji: '😨', label: 'Scared', isCorrect: false }] },
  { prompt: 'sad', promptEmoji: '😢', options: [{ emoji: '😄', label: 'Happy', isCorrect: false }, { emoji: '😢', label: 'Sad', isCorrect: true }, { emoji: '😡', label: 'Angry', isCorrect: false }, { emoji: '😴', label: 'Sleepy', isCorrect: false }] },
  { prompt: 'angry', promptEmoji: '😠', options: [{ emoji: '🥰', label: 'Loving', isCorrect: false }, { emoji: '😠', label: 'Angry', isCorrect: true }, { emoji: '😊', label: 'Happy', isCorrect: false }, { emoji: '😮', label: 'Surprised', isCorrect: false }] },
  { prompt: 'surprised', promptEmoji: '😮', options: [{ emoji: '😴', label: 'Sleepy', isCorrect: false }, { emoji: '😊', label: 'Happy', isCorrect: false }, { emoji: '😮', label: 'Surprised', isCorrect: true }, { emoji: '😢', label: 'Sad', isCorrect: false }] },
  { prompt: 'scared', promptEmoji: '😨', options: [{ emoji: '😨', label: 'Scared', isCorrect: true }, { emoji: '😄', label: 'Happy', isCorrect: false }, { emoji: '😠', label: 'Angry', isCorrect: false }, { emoji: '🥱', label: 'Bored', isCorrect: false }] },
  { prompt: 'loving', promptEmoji: '🥰', options: [{ emoji: '😢', label: 'Sad', isCorrect: false }, { emoji: '🥰', label: 'Loving', isCorrect: true }, { emoji: '😨', label: 'Scared', isCorrect: false }, { emoji: '😴', label: 'Sleepy', isCorrect: false }] },
  { prompt: 'sleepy', promptEmoji: '😴', options: [{ emoji: '😠', label: 'Angry', isCorrect: false }, { emoji: '😊', label: 'Happy', isCorrect: false }, { emoji: '😴', label: 'Sleepy', isCorrect: true }, { emoji: '😮', label: 'Surprised', isCorrect: false }] },
  { prompt: 'excited', promptEmoji: '🤩', options: [{ emoji: '🤩', label: 'Excited', isCorrect: true }, { emoji: '😢', label: 'Sad', isCorrect: false }, { emoji: '😨', label: 'Scared', isCorrect: false }, { emoji: '😠', label: 'Angry', isCorrect: false }] },
];

// ── Floating orb (decorative) ──
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

const EmotionDetectiveGame = ({ onBack }) => {
  const { speak } = useTTS();
  const { logActivity } = useUser();

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const promptScale = useRef(new Animated.Value(0.8)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;
  const optionAnims = useRef(ROUNDS[0].options.map(() => new Animated.Value(0))).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    speak('Emotion Detective! Find the face that matches the feeling.');
    animateRound();
  }, []);

  // ── Android back ──
  useEffect(() => {
    const onHardwareBack = () => { onBack(); return true; };
    BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBack);
  }, [onBack]);

  const animateRound = () => {
    promptScale.setValue(0.8);
    Animated.spring(promptScale, { toValue: 1, tension: 40, friction: 6, useNativeDriver: true }).start();
    optionAnims.forEach((a, i) => {
      a.setValue(0);
      Animated.timing(a, { toValue: 1, duration: 400, delay: 300 + i * 100, useNativeDriver: true }).start();
    });
  };

  const handleOptionPress = useCallback((option, idx) => {
    if (feedback) return;
    setSelectedIdx(idx);

    if (option.isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
      speak(`Yes! That's ${option.label}! Well done!`);
      setTimeout(() => {
        if (currentRound < ROUNDS.length - 1) {
          setCurrentRound(r => r + 1);
          setFeedback(null);
          setSelectedIdx(null);
          animateRound();
        } else {
          setGameComplete(true);
          speak('Wonderful! You finished the Emotion Detective game!');
          logActivity('Emotion Detective', 3);
          Animated.spring(celebrateAnim, { toValue: 1, tension: 40, friction: 5, useNativeDriver: true }).start();
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      speak(`That's ${option.label}. Try again!`);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      setTimeout(() => { setFeedback(null); setSelectedIdx(null); }, 800);
    }
  }, [feedback, currentRound, score, speak, logActivity]);

  const round = ROUNDS[currentRound];
  const progress = ((currentRound + (feedback === 'correct' ? 1 : 0)) / ROUNDS.length) * 100;

  // ── Game Complete Screen ──
  if (gameComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.waveContainer}>
          <Svg height={520} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <Defs>
              <LinearGradient id="edDone" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#064E3B" />
                <Stop offset="100%" stopColor={COLORS.success} />
              </LinearGradient>
            </Defs>
            <Path fill="url(#edDone)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
          </Svg>
        </View>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl }}>
          <Animated.View style={{
            transform: [{ scale: celebrateAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
            alignItems: 'center',
          }}>
            <Text style={styles.celebrateEmoji} accessibilityElementsHidden={true}>🕵️</Text>
            <Text style={styles.celebrateTitle} accessibilityRole="header">Detective Star!</Text>
            <Text style={styles.celebrateSubtitle} accessibilityLabel={`You identified ${score} out of ${ROUNDS.length} emotions correctly`}>
              You identified {score} out of {ROUNDS.length} emotions correctly!
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{score}/{ROUNDS.length}</Text>
                <Text style={styles.statLabel}>Score</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: COLORS.warning }]}>
                  {score >= 7 ? '⭐⭐⭐' : score >= 5 ? '⭐⭐' : '⭐'}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.playAgainBtn}
              onPress={() => { setCurrentRound(0); setScore(0); setFeedback(null); setSelectedIdx(null); setGameComplete(false); animateRound(); }}
              activeOpacity={0.85}
              accessibilityLabel="Play again"
              accessibilityRole="button"
            >
              <Text style={styles.playAgainText}>Play Again 🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backToGamesBtn}
              onPress={onBack}
              activeOpacity={0.85}
              accessibilityLabel="Back to games"
              accessibilityRole="button"
            >
              <Text style={styles.backToGamesText}>Back to Games</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  // ── Game Play Screen ──
  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={320} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="edGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primaryDeep} />
              <Stop offset="50%" stopColor="#7E22CE" />
              <Stop offset="100%" stopColor={COLORS.accentPink} />
            </LinearGradient>
          </Defs>
          <Path fill="url(#edGrad)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <FloatingOrb size={60} color="rgba(236,72,153,0.12)" top={80} left={width - 80} delay={0} />
      <FloatingOrb size={40} color="rgba(126,34,206,0.14)" top={50} left={30} delay={300} />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.headerTop, { opacity: headerFade }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            accessibilityHint="Returns to games menu"
          >
            <BackArrowIcon size={22} color="#9333EA" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title} accessibilityRole="header">Emotion Detective</Text>
            <Text style={styles.subtitleText}>Round {currentRound + 1} of {ROUNDS.length}</Text>
          </View>
        </Animated.View>

        {/* Progress */}
        <View style={styles.progressOuter} accessibilityLabel={`Progress: round ${currentRound + 1} of ${ROUNDS.length}`}>
          <View style={[styles.progressInner, { width: `${progress}%`, backgroundColor: COLORS.accentPink }]} />
        </View>

        {/* Prompt */}
        <View style={styles.promptArea}>
          <Animated.View
            style={[styles.promptCard, { transform: [{ scale: promptScale }, { translateX: shakeAnim }] }]}
            accessible={true}
            accessibilityLabel={`Find the face that looks ${round.prompt}`}
          >
            <Text style={styles.promptLabel}>Find the face that looks...</Text>
            <Text style={styles.promptWord}>{round.prompt}</Text>
            {feedback === 'correct' && <Text style={styles.feedbackCorrect}>✓ Correct!</Text>}
            {feedback === 'wrong' && <Text style={styles.feedbackWrong}>Try again!</Text>}
          </Animated.View>
        </View>

        {/* Options Grid */}
        <View style={styles.optionsGrid}>
          {round.options.map((option, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrectOption = option.isCorrect && feedback === 'correct';
            const isWrongOption = isSelected && feedback === 'wrong';

            return (
              <Animated.View key={idx} style={{ opacity: optionAnims[idx], transform: [{ scale: optionAnims[idx].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }}>
                <TouchableOpacity
                  style={[styles.optionCard, isCorrectOption && styles.optionCorrect, isWrongOption && styles.optionWrong]}
                  onPress={() => handleOptionPress(option, idx)}
                  disabled={!!feedback}
                  activeOpacity={0.85}
                  accessibilityLabel={`${option.label} face`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected, disabled: !!feedback }}
                >
                  <Text style={styles.optionEmoji} accessibilityElementsHidden={true}>{option.emoji}</Text>
                  <Text style={[styles.optionLabel, isCorrectOption && { color: COLORS.success }, isWrongOption && { color: COLORS.error }]}>{option.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
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
  title: { fontSize: FONT_SIZES.title1, fontWeight: FONT_WEIGHTS.black, color: COLORS.textOnDark, letterSpacing: 0.3, textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  subtitleText: { fontSize: FONT_SIZES.footnote, color: 'rgba(255,255,255,0.85)', fontWeight: FONT_WEIGHTS.semibold, marginTop: 3, letterSpacing: 0.5, textTransform: 'uppercase' },
  progressOuter: { height: 5, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: SPACING.xl, marginTop: SPACING.body, borderRadius: 3, overflow: 'hidden' },
  progressInner: { height: '100%', borderRadius: 3 },

  promptArea: { alignItems: 'center', paddingHorizontal: SPACING.xl, marginTop: 30 },
  promptCard: {
    backgroundColor: COLORS.surface, borderRadius: RADII.xxl, padding: SPACING.xxl,
    alignItems: 'center', width: '100%', ...SHADOWS.lg,
  },
  promptLabel: { fontSize: FONT_SIZES.subhead, color: COLORS.textSecondary, fontWeight: FONT_WEIGHTS.semibold, marginBottom: SPACING.sm },
  promptWord: { fontSize: FONT_SIZES.superDisplay, fontWeight: FONT_WEIGHTS.black, color: COLORS.textPrimary, textTransform: 'capitalize', letterSpacing: -0.5 },
  feedbackCorrect: { fontSize: FONT_SIZES.title3, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.success, marginTop: SPACING.md },
  feedbackWrong: { fontSize: FONT_SIZES.title3, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.error, marginTop: SPACING.md },

  optionsGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.base, paddingTop: SPACING.xl },
  optionCard: {
    backgroundColor: COLORS.surface, borderRadius: RADII.xl, padding: SPACING.lg,
    margin: SPACING.sm + 2, alignItems: 'center', width: (width - 80) / 2,
    borderWidth: 3, borderColor: COLORS.border, ...SHADOWS.md,
  },
  optionCorrect: { borderColor: COLORS.success, backgroundColor: '#F0FDF4' },
  optionWrong: { borderColor: COLORS.error, backgroundColor: '#FEF2F2' },
  optionEmoji: { fontSize: 52, marginBottom: SPACING.sm },
  optionLabel: { fontSize: FONT_SIZES.subhead, fontWeight: FONT_WEIGHTS.extrabold, color: '#334155' },

  celebrateEmoji: { fontSize: 80, marginBottom: SPACING.lg },
  celebrateTitle: { fontSize: FONT_SIZES.superDisplay, fontWeight: FONT_WEIGHTS.black, color: COLORS.textOnDark, marginBottom: SPACING.md, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  celebrateSubtitle: { fontSize: FONT_SIZES.subhead, color: 'rgba(255,255,255,0.85)', fontWeight: FONT_WEIGHTS.medium, textAlign: 'center', lineHeight: 24, marginBottom: SPACING.xxl },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: RADII.xl, padding: SPACING.xl, marginBottom: SPACING.xxl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FONT_SIZES.largeTitle + 4, fontWeight: FONT_WEIGHTS.black, color: COLORS.textOnDark, marginBottom: SPACING.xs },
  statLabel: { fontSize: FONT_SIZES.footnote, fontWeight: FONT_WEIGHTS.semibold, color: 'rgba(255,255,255,0.7)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  playAgainBtn: { backgroundColor: COLORS.surface, borderRadius: RADII.lg, paddingVertical: SPACING.base, paddingHorizontal: SPACING.huge, marginBottom: SPACING.body, ...SHADOWS.md },
  playAgainText: { fontSize: FONT_SIZES.title3, fontWeight: FONT_WEIGHTS.extrabold, color: COLORS.success },
  backToGamesBtn: { borderRadius: RADII.lg, paddingVertical: SPACING.body, paddingHorizontal: SPACING.xxxl, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  backToGamesText: { fontSize: FONT_SIZES.subhead, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textOnDark },
});

export default EmotionDetectiveGame;
