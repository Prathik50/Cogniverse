import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTTS } from '../../contexts/TTSContext';
import { useUser } from '../../contexts/UserContext';
import { BackArrowIcon } from '../../components/icons/ConditionIcons';
import { COLORS, TYPOGRAPHY, SPACING, RADII, SHADOWS } from '../../theme/theme';

const { width } = Dimensions.get('window');

const TOTAL_ROUNDS = 8;
const MAX_COUNT = 6;

// Fun Scattered Coordinates for up to MAX_COUNT objects
const SCATTER_POSITIONS = [
  { top: '15%', left: '15%' },
  { top: '65%', left: '25%' },
  { top: '25%', left: '60%' },
  { top: '60%', left: '65%' },
  { top: '40%', left: '40%' },
  { top: '10%', left: '42%' },
  { top: '80%', left: '45%' },
  { top: '45%', left: '10%' },
];

const generateRound = (maxCount = MAX_COUNT) => {
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

const ConfettiPiece = ({ index }: { index: number }) => {
  const fallAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fallAnim, { toValue: 1, duration: 800 + Math.random() * 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 1, duration: 800 + Math.random() * 400, useNativeDriver: true }),
      Animated.timing(rotateAnim, { toValue: 1, duration: 800 + Math.random() * 400, useNativeDriver: true }),
    ]).start();
  }, [fallAnim, slideAnim, rotateAnim]);

  const translateY = fallAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 300] });
  const translateX = slideAnim.interpolate({ 
    inputRange: [0, 1], 
    outputRange: [0, (index % 2 === 0 ? 1 : -1) * (Math.random() * 150)] 
  });
  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  
  const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];
  const color = colors[index % colors.length];

  return (
    <Animated.View style={{
      position: 'absolute',
      top: -20,
      left: width / 2,
      width: 12,
      height: 12,
      backgroundColor: color,
      transform: [{ translateX }, { translateY }, { rotate }]
    }} />
  );
};

const ConfettiBurst = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: 25 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}
    </View>
  );
};

interface CountAndTapScreenProps {
  onBack: () => void;
}

export const CountAndTapScreen: React.FC<CountAndTapScreenProps> = ({ onBack }) => {
  const { speak } = useTTS();
  const { logActivity } = useUser ? useUser() : { logActivity: () => {} };

  const [roundNum, setRoundNum] = useState(0);
  const [round, setRound] = useState(() => generateRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'neutral'|'correct'|'wrong'>('neutral');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [objectKey, setObjectKey] = useState(0);

  const mountFade = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(mountFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    speak('Count and Tap! Count the objects and tap the right number.');
  }, []);

  const nextRound = useCallback(() => {
    if (roundNum < TOTAL_ROUNDS - 1) {
      setRound(generateRound());
      setRoundNum((r) => r + 1);
      setFeedback('neutral');
      setSelectedAnswer(null);
      setObjectKey((k) => k + 1);
    } else {
      setGameComplete(true);
      speak('Amazing counting! You finished the game!');
      logActivity('Count and Tap', 2);
    }
  }, [roundNum, speak, logActivity]);

  const handleAnswer = useCallback(
    (answer: number) => {
      if (feedback !== 'neutral') return;

      setSelectedAnswer(answer);

      if (answer === round.count) {
        setFeedback('correct');
        setScore((s) => s + 1);
        speak(`Yes! There are ${round.count} ${round.label}. Well done!`);
        setTimeout(nextRound, 1200);
      } else {
        setFeedback('wrong');
        speak(`Not quite. Try again!`);
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();

        setTimeout(() => {
          setFeedback('neutral');
          setSelectedAnswer(null);
        }, 800);
      }
    },
    [feedback, round, nextRound, speak, shakeAnim]
  );

  const progressPercent = ((roundNum + (feedback === 'correct' ? 1 : 0)) / TOTAL_ROUNDS) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={240} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 240">
          <Defs>
            <LinearGradient id="ctPlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#0F766E" />
              <Stop offset="100%" stopColor="#06B6D4" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#ctPlayGrad)" d="M0,0 L0,200 Q720,240 1440,200 L1440,0 Z" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header Area */}
        <Animated.View style={[styles.headerArea, { opacity: mountFade }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <BackArrowIcon size={22} color={COLORS.textOnDark} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
             <View style={styles.headerTextRow}>
               <Text style={styles.headerStatsText}>{`ROUND ${roundNum + 1} OF ${TOTAL_ROUNDS}`}</Text>
               <Text style={styles.headerScoreText}>{`SCORE: ${score}`}</Text>
             </View>
            <View style={styles.progressOuter}>
              <View style={[styles.progressInner, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ flex: 1, opacity: mountFade, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md }}>
           
           {/* Primary White Target Action Area wrapping Question + Bounds */}
           <View style={styles.stageCard}>
              <View style={styles.questionBlock}>
                <Text style={styles.instructionText}>How many</Text>
                <Text style={styles.instructionWord}>{round.label}</Text>
                <Text style={styles.instructionText}>do you see?</Text>
              </View>

              {/* Bounded Object Area carrying absolute random bounds */}
              <View style={styles.boundedGarden} key={objectKey}>
                 {Array.from({ length: round.count }).map((_, i) => {
                    // Ensures emojis minimum size 50px per spec
                    const pos = SCATTER_POSITIONS[i % SCATTER_POSITIONS.length];
                    return (
                      <Animated.View
                        key={`${objectKey}-${i}`}
                        style={[styles.objectBubble, { top: pos.top as any, left: pos.left as any }]}
                      >
                        <Text style={styles.objectEmoji}>{round.emoji}</Text>
                      </Animated.View>
                    );
                 })}
                 {feedback === 'correct' ? <ConfettiBurst /> : null}
              </View>
           </View>

           {/* 2x2 Answer Grid */}
           <Animated.View style={[styles.answerGrid, { transform: [{ translateX: shakeAnim }] }]}>
              {round.options.map((opt) => {
                 const isSelected = selectedAnswer === opt;
                 const isCorrect = isSelected && feedback === 'correct';
                 const isWrong = isSelected && feedback === 'wrong';

                 return (
                   <TouchableOpacity
                     key={opt}
                     style={[
                       styles.answerBtn,
                       isCorrect && styles.answerCorrect,
                       isWrong && styles.answerWrong,
                     ]}
                     onPress={() => handleAnswer(opt)}
                     disabled={feedback !== 'neutral'}
                     activeOpacity={0.85}
                   >
                     <Text style={[
                       styles.answerText,
                       isCorrect && { color: COLORS.accentGreen },
                       isWrong && { color: '#EF4444' }
                     ]}>
                       {opt}
                     </Text>
                   </TouchableOpacity>
                 );
              })}
           </Animated.View>

        </Animated.View>
      </SafeAreaView>

      {/* Modern Victory Modal */}
      <Modal visible={gameComplete} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🌟</Text>
            <Text style={styles.modalTitle}>Great Counting!</Text>
            <Text style={styles.modalSubtitle}>{`You scored ${score} out of ${TOTAL_ROUNDS} points!`}</Text>

            <View style={styles.statsCard}>
               <View style={styles.statBox}>
                 <Text style={styles.statHighlight}>{`${score}/${TOTAL_ROUNDS}`}</Text>
                 <Text style={styles.statLabel}>Score</Text>
               </View>
               <View style={styles.statDivider} />
               <View style={styles.statBox}>
                 <Text style={[styles.statHighlight, { color: COLORS.accentOrange }]}>
                   {score >= 7 ? '⭐⭐⭐' : score >= 5 ? '⭐⭐' : '⭐'}
                 </Text>
                 <Text style={styles.statLabel}>Rating</Text>
               </View>
            </View>

            <TouchableOpacity 
              style={styles.playAgainBtn} 
              activeOpacity={0.8}
              onPress={() => {
                setRoundNum(0);
                setRound(generateRound());
                setScore(0);
                setFeedback('neutral');
                setSelectedAnswer(null);
                setGameComplete(false);
                setObjectKey(k => k + 1);
              }}
            >
              <Text style={styles.playAgainTxt}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.changeModeBtn} 
              activeOpacity={0.8}
              onPress={onBack}
            >
              <Text style={styles.changeModeTxt}>Back to Games</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    zIndex: 0,
  },
  headerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    zIndex: 10,
    marginBottom: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: RADII.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    marginRight: SPACING.md,
  },
  headerTitles: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  headerStatsText: {
    fontSize: TYPOGRAPHY.sizes.caption,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textOnDark,
    letterSpacing: 1.5,
  },
  headerScoreText: {
    fontSize: TYPOGRAPHY.sizes.caption,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: '#FDE047',
    letterSpacing: 1.5,
  },
  progressOuter: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADII.full,
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    backgroundColor: '#FDE047', // Yellow accent
  },

  stageCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.elevated,
  },
  questionBlock: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  instructionText: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.semibold as any,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  instructionWord: {
    fontSize: TYPOGRAPHY.sizes.h1,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginVertical: 4,
  },
  boundedGarden: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F0FDFA', // Super light teal bound map
    borderRadius: RADII.xl,
    borderWidth: 2,
    borderColor: '#CCFBF1',
    position: 'relative',
    overflow: 'hidden',
  },
  objectBubble: {
    position: 'absolute',
    borderRadius: RADII.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    ...SHADOWS.card,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
  },
  objectEmoji: {
    fontSize: 34,
  },

  answerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // 2x2 grid mapped cleanly over the bottom space
    paddingHorizontal: SPACING.sm,
  },
  answerBtn: {
    width: '47%', // slightly under 50% to leave a clear 6% total gap layout
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  answerCorrect: {
    borderColor: COLORS.accentGreen,
    backgroundColor: '#D1FAE5',
  },
  answerWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  answerText: {
    fontSize: TYPOGRAPHY.sizes.hero,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textPrimary,
  },

  // Modal Standards
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.elevated,
  },
  modalEmoji: {
    fontSize: 72,
    marginBottom: SPACING.sm,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.h1,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.medium as any,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    width: '100%',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statHighlight: {
    fontSize: TYPOGRAPHY.sizes.h1,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.caption,
    fontWeight: TYPOGRAPHY.weights.bold as any,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 2,
    backgroundColor: COLORS.borderLight,
  },
  playAgainBtn: {
    width: '100%',
    backgroundColor: '#0EA5E9', // matching game theme
    padding: SPACING.md,
    borderRadius: RADII.lg,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  playAgainTxt: {
    color: COLORS.textOnDark,
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.bold as any,
  },
  changeModeBtn: {
    width: '100%',
    padding: SPACING.md,
    borderRadius: RADII.lg,
    alignItems: 'center',
  },
  changeModeTxt: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.bold as any,
  },
});

export default CountAndTapScreen;
