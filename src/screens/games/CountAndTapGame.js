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

// Generate a counting round
const generateRound = (maxCount = 5) => {
  const objects = [
    { emoji: '⭐', label: 'stars' },
    { emoji: '🍎', label: 'apples' },
    { emoji: '🐶', label: 'dogs' },
    { emoji: '🌸', label: 'flowers' },
    { emoji: '🐱', label: 'cats' },
    { emoji: '🎈', label: 'balloons' },
    { emoji: '🦋', label: 'butterflies' },
    { emoji: '🐠', label: 'fish' },
    { emoji: '🌻', label: 'sunflowers' },
    { emoji: '🐦', label: 'birds' },
  ];

  const obj = objects[Math.floor(Math.random() * objects.length)];
  const count = Math.floor(Math.random() * maxCount) + 1;

  // Generate 4 answer options (including correct)
  const options = new Set([count]);
  while (options.size < 4) {
    const opt = Math.max(1, count + Math.floor(Math.random() * 5) - 2);
    if (opt <= maxCount + 2) options.add(opt);
  }
  const sortedOptions = [...options].sort((a, b) => a - b);

  return {
    emoji: obj.emoji,
    label: obj.label,
    count,
    options: sortedOptions,
  };
};

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

// Animated object renderer with pop-in effect
const CountObject = ({ emoji, index, size }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 60,
      friction: 6,
      delay: index * 120,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.objectBubble, { width: size, height: size, transform: [{ scale: scaleAnim }] }]}>
      <Text style={[styles.objectEmoji, { fontSize: size * 0.55 }]}>{emoji}</Text>
    </Animated.View>
  );
};

const TOTAL_ROUNDS = 8;

const CountAndTapGame = ({ onBack }) => {
  const { speak } = useTTS();
  const { logActivity } = useUser();

  const [roundNum, setRoundNum] = useState(0);
  const [round, setRound] = useState(() => generateRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [objectKey, setObjectKey] = useState(0); // For re-triggering object animations

  const headerFade = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    speak(`Count and Tap! Count the objects and tap the right number.`);
  }, []);

  const nextRound = useCallback(() => {
    if (roundNum < TOTAL_ROUNDS - 1) {
      const newRound = generateRound();
      setRound(newRound);
      setRoundNum(r => r + 1);
      setFeedback(null);
      setSelectedAnswer(null);
      setObjectKey(k => k + 1);
    } else {
      setGameComplete(true);
      speak('Amazing counting! You finished the game!');
      logActivity('Count and Tap', 2);
      Animated.spring(celebrateAnim, { toValue: 1, tension: 40, friction: 5, useNativeDriver: true }).start();
    }
  }, [roundNum, speak, logActivity]);

  const handleAnswer = useCallback((answer) => {
    if (feedback) return;
    setSelectedAnswer(answer);

    if (answer === round.count) {
      setFeedback('correct');
      setScore(s => s + 1);
      speak(`Yes! There are ${round.count} ${round.label}. Well done!`);
      setTimeout(nextRound, 1500);
    } else {
      setFeedback('wrong');
      speak(`Not quite. Count again! There are ${round.count} ${round.label}.`);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      setTimeout(() => { setFeedback(null); setSelectedAnswer(null); }, 1200);
    }
  }, [feedback, round, nextRound, speak, shakeAnim]);

  const progress = ((roundNum + (feedback === 'correct' ? 1 : 0)) / TOTAL_ROUNDS) * 100;
  const objectSize = Math.min(70, (width - 100) / Math.ceil(Math.sqrt(round.count + 1)));

  // Game Complete
  if (gameComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.waveContainer}>
          <Svg height={520} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <Defs>
              <LinearGradient id="ctDone" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#064E3B" />
                <Stop offset="100%" stopColor="#10B981" />
              </LinearGradient>
            </Defs>
            <Path fill="url(#ctDone)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
          </Svg>
        </View>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Animated.View style={{
            transform: [{ scale: celebrateAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
            alignItems: 'center',
          }}>
            <Text style={styles.celebrateEmoji}>🎯</Text>
            <Text style={styles.celebrateTitle}>Great Counting!</Text>
            <Text style={styles.celebrateSubtitle}>You got {score} out of {TOTAL_ROUNDS} rounds right!</Text>
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
              setRoundNum(0); setRound(generateRound()); setScore(0);
              setFeedback(null); setSelectedAnswer(null); setGameComplete(false);
              setObjectKey(k => k + 1);
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
            <LinearGradient id="ctGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#1E1B4B" />
              <Stop offset="50%" stopColor="#0E7490" />
              <Stop offset="100%" stopColor="#06B6D4" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#ctGrad)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <FloatingOrb size={60} color="rgba(6,182,212,0.12)" top={80} left={width - 80} delay={0} />
      <FloatingOrb size={40} color="rgba(14,116,144,0.14)" top={50} left={30} delay={300} />

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[styles.headerTop, { opacity: headerFade }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <BackArrowIcon size={22} color="#0891B2" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Count & Tap</Text>
            <Text style={styles.subtitleText}>Round {roundNum + 1} of {TOTAL_ROUNDS} • Score: {score}</Text>
          </View>
        </Animated.View>

        {/* Progress */}
        <View style={styles.progressOuter}>
          <View style={[styles.progressInner, { width: `${progress}%`, backgroundColor: '#06B6D4' }]} />
        </View>

        {/* Instruction */}
        <Animated.View style={[styles.instructionCard, { transform: [{ translateX: shakeAnim }] }]}>
          <Text style={styles.instructionText}>
            How many {round.label} do you see?
          </Text>
          {feedback === 'correct' && <Text style={styles.feedbackCorrect}>✓ Correct!</Text>}
          {feedback === 'wrong' && <Text style={styles.feedbackWrong}>Try again! Count carefully.</Text>}
        </Animated.View>

        {/* Objects Display */}
        <View style={styles.objectsArea} key={objectKey}>
          <View style={styles.objectsGrid}>
            {Array.from({ length: round.count }).map((_, i) => (
              <CountObject key={`${objectKey}-${i}`} emoji={round.emoji} index={i} size={objectSize} />
            ))}
          </View>
        </View>

        {/* Answer Options */}
        <View style={styles.answersRow}>
          {round.options.map((opt) => {
            const isSelected = selectedAnswer === opt;
            const isCorrectOpt = opt === round.count && feedback === 'correct';
            const isWrongOpt = isSelected && feedback === 'wrong';

            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.answerBtn,
                  isCorrectOpt && styles.answerCorrect,
                  isWrongOpt && styles.answerWrong,
                ]}
                onPress={() => handleAnswer(opt)}
                disabled={!!feedback}
                activeOpacity={0.85}
              >
                <Text style={[
                  styles.answerText,
                  isCorrectOpt && { color: '#10B981' },
                  isWrongOpt && { color: '#EF4444' },
                ]}>{opt}</Text>
              </TouchableOpacity>
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

  // Instruction
  instructionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20,
    marginHorizontal: 24, marginTop: 24, alignItems: 'center',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 6,
  },
  instructionText: { fontSize: 20, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  feedbackCorrect: { fontSize: 16, fontWeight: '800', color: '#10B981', marginTop: 8 },
  feedbackWrong: { fontSize: 16, fontWeight: '800', color: '#EF4444', marginTop: 8 },

  // Objects
  objectsArea: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20,
  },
  objectsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', alignItems: 'center',
  },
  objectBubble: {
    borderRadius: 20, backgroundColor: '#FFFFFF', margin: 8,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
    borderWidth: 2, borderColor: '#E2E8F0',
  },
  objectEmoji: {},

  // Answers
  answersRow: {
    flexDirection: 'row', justifyContent: 'center',
    paddingHorizontal: 20, paddingBottom: 30,
  },
  answerBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 20, paddingVertical: 18,
    paddingHorizontal: 24, marginHorizontal: 8, minWidth: 64,
    alignItems: 'center', borderWidth: 3, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  answerCorrect: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  answerWrong: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  answerText: { fontSize: 26, fontWeight: '900', color: '#334155' },

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

export default CountAndTapGame;
