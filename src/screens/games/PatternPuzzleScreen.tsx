import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTTS } from '../../contexts/TTSContext';
import { useUser } from '../../contexts/UserContext';
import { BackArrowIcon } from '../../components/icons/ConditionIcons';
import { COLORS, TYPOGRAPHY, SPACING, RADII, SHADOWS } from '../../theme/theme';

const { width } = Dimensions.get('window');

const PATTERNS = [
  { sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], answer: '🔵', options: ['🔵', '🟢', '🟡', '🔴'], hint: 'Red, Blue, Red, Blue, Red, ...' },
  { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], answer: '🌙', options: ['⭐', '🌙', '☀️', '🌈'], hint: 'Star, Star, Moon, Star, Star, ...' },
  { sequence: ['🍎', '🍊', '🍎', '🍊', '🍎'], answer: '🍊', options: ['🍎', '🍊', '🍇', '🍋'], hint: 'Apple, Orange, Apple, Orange, Apple, ...' },
  { sequence: ['🐶', '🐱', '🐶', '🐱', '🐶'], answer: '🐱', options: ['🐱', '🐶', '🐦', '🐠'], hint: 'Dog, Cat, Dog, Cat, Dog, ...' },
  { sequence: ['🟡', '🟡', '🟢', '🟡', '🟡'], answer: '🟢', options: ['🟢', '🔵', '🟡', '🔴'], hint: 'Yellow, Yellow, Green, Yellow, Yellow, ...' },
  { sequence: ['🌻', '🌷', '🌻', '🌷', '🌻'], answer: '🌷', options: ['🌻', '🌷', '🌹', '🌸'], hint: 'Sunflower, Tulip, Sunflower, Tulip, Sunflower, ...' },
  { sequence: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'], answer: '6️⃣', options: ['7️⃣', '6️⃣', '3️⃣', '8️⃣'], hint: '1, 2, 3, 4, 5, ...' },
  { sequence: ['🔵', '🔵', '🔴', '🔵', '🔵'], answer: '🔴', options: ['🔴', '🟢', '🔵', '🟡'], hint: 'Blue, Blue, Red, Blue, Blue, ...' },
  { sequence: ['🐟', '🐟', '🐙', '🐟', '🐟'], answer: '🐙', options: ['🐟', '🦀', '🐙', '🐬'], hint: 'Fish, Fish, Octopus, Fish, Fish, ...' },
  { sequence: ['△', '○', '△', '○', '△'], answer: '○', options: ['□', '○', '△', '◇'], hint: 'Triangle, Circle, Triangle, Circle, Triangle, ...' },
];

const shuffle = (arr: any[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const TOTAL_ROUNDS = 8;

interface PatternPuzzleScreenProps {
  onBack: () => void;
}

export const PatternPuzzleScreen: React.FC<PatternPuzzleScreenProps> = ({ onBack }) => {
  const { speak } = useTTS();
  const { logActivity } = useUser ? useUser() : { logActivity: () => {} };

  const [rounds] = useState(() => shuffle(PATTERNS).slice(0, TOTAL_ROUNDS));
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'neutral'|'correct'|'wrong'>('neutral');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const mountFade = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const snapInAnim = useRef(new Animated.Value(0)).current; // Animates the correct answer slot

  useEffect(() => {
    Animated.timing(mountFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    speak('Pattern Puzzle! Find what comes next in the pattern.');
    startPulse();
  }, []);

  const startPulse = () => {
    pulseAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  };

  const handleAnswer = useCallback((answer: string) => {
    if (feedback !== 'neutral') return;

    setSelectedAnswer(answer);
    const round = rounds[roundIdx];

    if (answer === round.answer) {
      setFeedback('correct');
      setScore((s) => s + 1);
      speak('Perfect! You found the pattern!');

      // Snap in animation for the question mark square
      Animated.spring(snapInAnim, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }).start();

      setTimeout(() => {
        if (roundIdx < TOTAL_ROUNDS - 1) {
          setRoundIdx((r) => r + 1);
          setFeedback('neutral');
          setSelectedAnswer(null);
          setShowHint(false);
          snapInAnim.setValue(0);
        } else {
          setGameComplete(true);
          speak('You are a pattern master!');
          logActivity('Pattern Puzzle', 3);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      speak('Not quite. Look at the pattern again!');
      
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
      }, 1000);
    }
  }, [feedback, roundIdx, rounds, speak, logActivity]);

  const round = rounds[roundIdx];
  const progressPercent = ((roundIdx + (feedback === 'correct' ? 1 : 0)) / TOTAL_ROUNDS) * 100;
  
  // Interpolations
  const pulseScale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
  const snappedScale = snapInAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <View style={styles.container}>
      {/* Background Gradient SVG Map */}
      <View style={styles.waveContainer}>
        <Svg height={240} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 240">
          <Defs>
            <LinearGradient id="ppPlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#7E22CE" />
              <Stop offset="100%" stopColor="#D946EF" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#ppPlayGrad)" d="M0,0 L0,200 Q720,240 1440,200 L1440,0 Z" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header HUD */}
        <Animated.View style={[styles.headerArea, { opacity: mountFade }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <BackArrowIcon size={22} color={COLORS.textOnDark} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
             <View style={styles.headerTextRow}>
               <Text style={styles.headerStatsText}>{`ROUND ${roundIdx + 1} OF ${TOTAL_ROUNDS}`}</Text>
               <Text style={styles.headerScoreText}>{`SCORE: ${score}`}</Text>
             </View>
            <View style={styles.progressOuter}>
              <View style={[styles.progressInner, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.mainLayout, { opacity: mountFade }]}>
          
          <Text style={styles.promptText}>What comes next?</Text>

          {/* Scrolling Pattern Area */}
          <Animated.View style={[styles.patternStripContainer, { transform: [{ translateX: shakeAnim }] }]}>
             <ScrollView 
               horizontal 
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.patternScrollContent}
             >
                {round.sequence.map((item: string, idx: number) => (
                  <View key={`seq-${idx}`} style={styles.patternTile}>
                    <Text style={styles.patternEmoji}>{item}</Text>
                  </View>
                ))}

                {/* Target Drop Zone */}
                {feedback === 'correct' ? (
                   <Animated.View style={[styles.patternTile, styles.patternTileCorrect, { transform: [{ scale: snappedScale }] }]}>
                      <Text style={styles.patternEmoji}>{round.answer}</Text>
                   </Animated.View>
                ) : (
                   <Animated.View style={[styles.patternDropZone, { transform: [{ scale: pulseScale }] }]}>
                      <Text style={styles.questionMark}>?</Text>
                   </Animated.View>
                )}
             </ScrollView>
          </Animated.View>

          {/* Hint Area */}
          <View style={styles.hintSection}>
             <TouchableOpacity 
               style={styles.hintPill} 
               onPress={() => {
                 setShowHint(!showHint);
                 if (!showHint) speak(round.hint);
               }} 
               activeOpacity={0.8}
             >
                <Text style={styles.hintPillIcon}>💡</Text>
                <Text style={styles.hintPillText}>Need a hint?</Text>
             </TouchableOpacity>

             {showHint ? (
               <View style={styles.hintMessageBox}>
                  <Text style={styles.hintMessageText}>{round.hint}</Text>
               </View>
             ) : null}
          </View>

          {/* Spacer pushing grid smoothly */}
          <View style={{ flex: 1 }} />

          {/* Answer 2x2 Grid Bottom-Locked */}
          <View style={styles.answerGrid}>
            {round.options.map((opt: string, idx: number) => {
               const isSelected = selectedAnswer === opt;
               const isCorrectOpt = isSelected && feedback === 'correct';
               const isWrongOpt = isSelected && feedback === 'wrong';

               return (
                  <TouchableOpacity
                    key={`opt-${idx}`}
                    style={[
                      styles.answerBlock,
                      isCorrectOpt && styles.blockCorrect,
                      isWrongOpt && styles.blockWrong,
                    ]}
                    onPress={() => handleAnswer(opt)}
                    disabled={feedback !== 'neutral'}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.answerEmoji}>{opt}</Text>
                  </TouchableOpacity>
               );
            })}
          </View>

        </Animated.View>
      </SafeAreaView>

      {/* Victory Modal */}
      <Modal visible={gameComplete} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🧩</Text>
            <Text style={styles.modalTitle}>Pattern Master!</Text>
            <Text style={styles.modalSubtitle}>{`You solved ${score} out of ${TOTAL_ROUNDS} puzzles!`}</Text>

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
                setRoundIdx(0);
                setScore(0);
                setFeedback('neutral');
                setSelectedAnswer(null);
                setShowHint(false);
                setGameComplete(false);
                snapInAnim.setValue(0);
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
    marginBottom: SPACING.xl,
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
    backgroundColor: '#FDE047',
  },

  mainLayout: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },

  promptText: {
    fontSize: TYPOGRAPHY.sizes.h1,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  // Pattern View
  patternStripContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.card,
    marginBottom: SPACING.xl,
  },
  patternScrollContent: {
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  patternTile: {
    width: 64,
    height: 64,
    backgroundColor: '#F1F5F9', // light gray
    borderRadius: RADII.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  patternTileCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  patternDropZone: {
    width: 64,
    height: 64,
    backgroundColor: '#F3E8FF', // extremely soft purple target
    borderRadius: RADII.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 3,
    borderColor: '#A855F7',
    borderStyle: 'dashed',
  },
  patternEmoji: {
    fontSize: 32,
  },
  questionMark: {
    fontSize: 32,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: '#A855F7',
  },

  // Hints
  hintSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADII.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  hintPillIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  hintPillText: {
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.bold as any,
    color: '#D97706',
  },
  hintMessageBox: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    width: '100%',
    ...SHADOWS.card,
  },
  hintMessageText: {
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.semibold as any,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Answers Grid
  answerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  answerBlock: {
    width: '47%',
    height: 80, // explicit user request 80x80 style but responsive wrapper
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  blockCorrect: {
    borderColor: COLORS.accentGreen,
    backgroundColor: '#D1FAE5',
  },
  blockWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  answerEmoji: {
    fontSize: 40,
  },

  // Modal
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
    backgroundColor: '#A855F7',
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

export default PatternPuzzleScreen;
