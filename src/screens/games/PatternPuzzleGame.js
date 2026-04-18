import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTTS } from '../../contexts/TTSContext';
import { useUser } from '../../contexts/UserContext';
import { BackArrowIcon } from '../../components/icons/ConditionIcons';

const { width } = Dimensions.get('window');

// Pattern types
const PATTERNS = [
  {
    sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'],
    answer: '🔵',
    options: ['🔵', '🟢', '🟡', '🔴'],
    hint: 'Red, Blue, Red, Blue, Red, ...',
  },
  {
    sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'],
    answer: '🌙',
    options: ['⭐', '🌙', '☀️', '🌈'],
    hint: 'Star, Star, Moon, Star, Star, ...',
  },
  {
    sequence: ['🍎', '🍊', '🍎', '🍊', '🍎'],
    answer: '🍊',
    options: ['🍎', '🍊', '🍇', '🍋'],
    hint: 'Apple, Orange, Apple, Orange, Apple, ...',
  },
  {
    sequence: ['🐶', '🐱', '🐶', '🐱', '🐶'],
    answer: '🐱',
    options: ['🐱', '🐶', '🐦', '🐠'],
    hint: 'Dog, Cat, Dog, Cat, Dog, ...',
  },
  {
    sequence: ['🟡', '🟡', '🟢', '🟡', '🟡'],
    answer: '🟢',
    options: ['🟢', '🔵', '🟡', '🔴'],
    hint: 'Yellow, Yellow, Green, Yellow, Yellow, ...',
  },
  {
    sequence: ['🌻', '🌷', '🌻', '🌷', '🌻'],
    answer: '🌷',
    options: ['🌻', '🌷', '🌹', '🌸'],
    hint: 'Sunflower, Tulip, Sunflower, Tulip, Sunflower, ...',
  },
  {
    sequence: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'],
    answer: '6️⃣',
    options: ['7️⃣', '6️⃣', '3️⃣', '8️⃣'],
    hint: '1, 2, 3, 4, 5, ...',
  },
  {
    sequence: ['🔵', '🔵', '🔴', '🔵', '🔵'],
    answer: '🔴',
    options: ['🔴', '🟢', '🔵', '🟡'],
    hint: 'Blue, Blue, Red, Blue, Blue, ...',
  },
  {
    sequence: ['🐟', '🐟', '🐙', '🐟', '🐟'],
    answer: '🐙',
    options: ['🐟', '🦀', '🐙', '🐬'],
    hint: 'Fish, Fish, Octopus, Fish, Fish, ...',
  },
  {
    sequence: ['△', '○', '△', '○', '△'],
    answer: '○',
    options: ['□', '○', '△', '◇'],
    hint: 'Triangle, Circle, Triangle, Circle, Triangle, ...',
  },
];

const TOTAL_ROUNDS = 8;

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
    <Animated.View style={{
      position: 'absolute', top, left, width: size, height: size,
      borderRadius: size / 2, backgroundColor: color,
      opacity: opacityAnim, transform: [{ translateY }],
    }} />
  );
};

const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const PatternPuzzleGame = ({ onBack }) => {
  const { speak } = useTTS();
  const { logActivity } = useUser();

  const [rounds] = useState(() => shuffle(PATTERNS).slice(0, TOTAL_ROUNDS));
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const patternAnims = useRef(Array.from({ length: 6 }, () => new Animated.Value(0))).current;
  const questionMarkAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;
  const optionAnims = useRef(Array.from({ length: 4 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    speak('Pattern Puzzle! Find what comes next in the pattern.');
    animateRound();
  }, []);

  const animateRound = () => {
    patternAnims.forEach((a, i) => {
      a.setValue(0);
      Animated.timing(a, { toValue: 1, duration: 300, delay: i * 150, useNativeDriver: true }).start();
    });
    questionMarkAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(questionMarkAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(questionMarkAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
    optionAnims.forEach((a, i) => {
      a.setValue(0);
      Animated.timing(a, { toValue: 1, duration: 400, delay: 800 + i * 100, useNativeDriver: true }).start();
    });
  };

  const handleAnswer = useCallback((answer) => {
    if (feedback) return;
    setSelectedAnswer(answer);
    const round = rounds[roundIdx];

    if (answer === round.answer) {
      setFeedback('correct');
      setScore(s => s + 1);
      speak('Perfect! You found the pattern!');

      setTimeout(() => {
        if (roundIdx < TOTAL_ROUNDS - 1) {
          setRoundIdx(r => r + 1);
          setFeedback(null);
          setSelectedAnswer(null);
          setShowHint(false);
          animateRound();
        } else {
          setGameComplete(true);
          speak('You are a pattern master!');
          logActivity('Pattern Puzzle', 3);
          Animated.spring(celebrateAnim, { toValue: 1, tension: 40, friction: 5, useNativeDriver: true }).start();
        }
      }, 1300);
    } else {
      setFeedback('wrong');
      speak('Not quite. Look at the pattern again!');
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      setTimeout(() => { setFeedback(null); setSelectedAnswer(null); }, 1000);
    }
  }, [feedback, roundIdx, rounds, speak, logActivity]);

  const round = rounds[roundIdx];
  const progress = ((roundIdx + (feedback === 'correct' ? 1 : 0)) / TOTAL_ROUNDS) * 100;
  const qPulse = questionMarkAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });

  // Game Complete
  if (gameComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.waveContainer}>
          <Svg height={520} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <Defs>
              <LinearGradient id="ppDone" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#064E3B" />
                <Stop offset="100%" stopColor="#10B981" />
              </LinearGradient>
            </Defs>
            <Path fill="url(#ppDone)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
          </Svg>
        </View>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Animated.View style={{
            transform: [{ scale: celebrateAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
            alignItems: 'center',
          }}>
            <Text style={styles.celebrateEmoji}>🧩</Text>
            <Text style={styles.celebrateTitle}>Pattern Master!</Text>
            <Text style={styles.celebrateSubtitle}>You solved {score} out of {TOTAL_ROUNDS} patterns!</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{score}/{TOTAL_ROUNDS}</Text>
                <Text style={styles.statLabel}>Score</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                  {score >= 7 ? '⭐⭐⭐' : score >= 5 ? '⭐⭐' : '⭐'}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.playAgainBtn} onPress={() => {
              setRoundIdx(0); setScore(0); setFeedback(null);
              setSelectedAnswer(null); setShowHint(false); setGameComplete(false);
              animateRound();
            }} activeOpacity={0.85}>
              <Text style={styles.playAgainText}>Play Again 🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backToGamesBtn} onPress={onBack} activeOpacity={0.85}>
              <Text style={styles.backToGamesText}>Back to Games</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={280} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="ppGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#1E1B4B" />
              <Stop offset="50%" stopColor="#9333EA" />
              <Stop offset="100%" stopColor="#D946EF" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#ppGrad)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <FloatingOrb size={60} color="rgba(217,70,239,0.12)" top={80} left={width - 80} delay={0} />
      <FloatingOrb size={40} color="rgba(147,51,234,0.14)" top={50} left={30} delay={300} />

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[styles.headerTop, { opacity: headerFade }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <BackArrowIcon size={22} color="#9333EA" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Pattern Puzzle</Text>
            <Text style={styles.subtitleText}>Round {roundIdx + 1} of {TOTAL_ROUNDS} • Score: {score}</Text>
          </View>
        </Animated.View>

        {/* Progress */}
        <View style={styles.progressOuter}>
          <View style={[styles.progressInner, { width: `${progress}%`, backgroundColor: '#D946EF' }]} />
        </View>

        {/* Pattern Display */}
        <View style={styles.patternArea}>
          <Text style={styles.patternPrompt}>What comes next?</Text>

          <Animated.View style={[styles.patternRow, { transform: [{ translateX: shakeAnim }] }]}>
            {round.sequence.map((item, idx) => (
              <Animated.View key={idx} style={[styles.patternItem, {
                opacity: patternAnims[Math.min(idx, 5)],
                transform: [{ scale: patternAnims[Math.min(idx, 5)] }],
              }]}>
                <Text style={styles.patternEmoji}>{item}</Text>
              </Animated.View>
            ))}
            {/* Question mark */}
            <Animated.View style={[styles.patternItem, styles.patternQuestion, {
              transform: [{ scale: qPulse }],
            }]}>
              <Text style={styles.questionMark}>?</Text>
            </Animated.View>
          </Animated.View>

          {/* Hint Toggle */}
          <TouchableOpacity style={styles.hintBtn} onPress={() => {
            setShowHint(!showHint);
            if (!showHint) speak(round.hint);
          }} activeOpacity={0.8}>
            <Text style={styles.hintText}>{showHint ? '💡 ' + round.hint : '💡 Need a hint?'}</Text>
          </TouchableOpacity>

          {feedback === 'correct' && <Text style={styles.feedbackCorrect}>✓ Perfect!</Text>}
          {feedback === 'wrong' && <Text style={styles.feedbackWrong}>Try again!</Text>}
        </View>

        {/* Answer Options */}
        <View style={styles.optionsRow}>
          {round.options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const isCorrectOpt = opt === round.answer && feedback === 'correct';
            const isWrongOpt = isSelected && feedback === 'wrong';

            return (
              <Animated.View key={idx} style={{
                opacity: optionAnims[idx],
                transform: [{ scale: optionAnims[idx].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
              }}>
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    isCorrectOpt && styles.optionCorrect,
                    isWrongOpt && styles.optionWrong,
                  ]}
                  onPress={() => handleAnswer(opt)}
                  disabled={!!feedback}
                  activeOpacity={0.85}
                >
                  <Text style={styles.optionEmoji}>{opt}</Text>
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  waveContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0 },
  headerTop: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, marginTop: 16, zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 20,
    width: 44, height: 44, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#1E1B4B', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  headerTitles: { flex: 1, alignItems: 'center', marginRight: 44 },
  title: {
    fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
  },
  subtitleText: {
    fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600',
    marginTop: 3, letterSpacing: 0.5, textTransform: 'uppercase',
  },
  progressOuter: {
    height: 5, backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 24, marginTop: 14, borderRadius: 3, overflow: 'hidden',
  },
  progressInner: { height: '100%', borderRadius: 3 },

  // Pattern area
  patternArea: { alignItems: 'center', paddingHorizontal: 20, marginTop: 28, flex: 1 },
  patternPrompt: {
    fontSize: 22, fontWeight: '800', color: '#1E293B', marginBottom: 24,
  },
  patternRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },
  patternItem: {
    width: 52, height: 52, borderRadius: 16, margin: 4,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  patternEmoji: { fontSize: 28 },
  patternQuestion: {
    backgroundColor: '#DDD6FE', borderWidth: 2, borderColor: '#A78BFA',
    borderStyle: 'dashed',
  },
  questionMark: { fontSize: 28, fontWeight: '900', color: '#7C3AED' },
  hintBtn: {
    marginTop: 20, paddingHorizontal: 20, paddingVertical: 10,
    backgroundColor: '#FEF3C7', borderRadius: 14,
  },
  hintText: { fontSize: 14, fontWeight: '700', color: '#92400E' },
  feedbackCorrect: { fontSize: 18, fontWeight: '800', color: '#10B981', marginTop: 16 },
  feedbackWrong: { fontSize: 18, fontWeight: '800', color: '#EF4444', marginTop: 16 },

  // Options
  optionsRow: {
    flexDirection: 'row', justifyContent: 'center',
    paddingHorizontal: 16, paddingBottom: 30,
  },
  optionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18,
    margin: 8, alignItems: 'center', borderWidth: 3, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    minWidth: 72,
  },
  optionCorrect: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  optionEmoji: { fontSize: 36 },

  // Celebration
  celebrateEmoji: { fontSize: 80, marginBottom: 20 },
  celebrateTitle: {
    fontSize: 36, fontWeight: '900', color: '#FFFFFF', marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
  },
  celebrateSubtitle: {
    fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '500',
    textAlign: 'center', lineHeight: 24, marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24, padding: 24, marginBottom: 32,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  playAgainBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 16,
    paddingHorizontal: 48, marginBottom: 14,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
  },
  playAgainText: { fontSize: 18, fontWeight: '800', color: '#10B981' },
  backToGamesBtn: {
    borderRadius: 20, paddingVertical: 14, paddingHorizontal: 40,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  backToGamesText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});

export default PatternPuzzleGame;
