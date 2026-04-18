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
import { EmotionCard } from '../../components/EmotionCard';
import { COLORS, TYPOGRAPHY, SPACING, RADII, SHADOWS } from '../../theme/theme';

const { width } = Dimensions.get('window');

const ROUNDS = [
  { prompt: 'happy', options: [{ emoji: '😊', label: 'Happy', isCorrect: true }, { emoji: '😢', label: 'Sad', isCorrect: false }, { emoji: '😠', label: 'Angry', isCorrect: false }, { emoji: '😨', label: 'Scared', isCorrect: false }] },
  { prompt: 'sad', options: [{ emoji: '😄', label: 'Happy', isCorrect: false }, { emoji: '😢', label: 'Sad', isCorrect: true }, { emoji: '😡', label: 'Angry', isCorrect: false }, { emoji: '😴', label: 'Sleepy', isCorrect: false }] },
  { prompt: 'angry', options: [{ emoji: '🥰', label: 'Loving', isCorrect: false }, { emoji: '😠', label: 'Angry', isCorrect: true }, { emoji: '😊', label: 'Happy', isCorrect: false }, { emoji: '😮', label: 'Surprised', isCorrect: false }] },
  { prompt: 'surprised', options: [{ emoji: '😴', label: 'Sleepy', isCorrect: false }, { emoji: '😊', label: 'Happy', isCorrect: false }, { emoji: '😮', label: 'Surprised', isCorrect: true }, { emoji: '😢', label: 'Sad', isCorrect: false }] },
  { prompt: 'scared', options: [{ emoji: '😨', label: 'Scared', isCorrect: true }, { emoji: '😄', label: 'Happy', isCorrect: false }, { emoji: '😠', label: 'Angry', isCorrect: false }, { emoji: '🥱', label: 'Bored', isCorrect: false }] },
  { prompt: 'loving', options: [{ emoji: '😢', label: 'Sad', isCorrect: false }, { emoji: '🥰', label: 'Loving', isCorrect: true }, { emoji: '😨', label: 'Scared', isCorrect: false }, { emoji: '😴', label: 'Sleepy', isCorrect: false }] },
  { prompt: 'sleepy', options: [{ emoji: '😠', label: 'Angry', isCorrect: false }, { emoji: '😊', label: 'Happy', isCorrect: false }, { emoji: '😴', label: 'Sleepy', isCorrect: true }, { emoji: '😮', label: 'Surprised', isCorrect: false }] },
  { prompt: 'excited', options: [{ emoji: '🤩', label: 'Excited', isCorrect: true }, { emoji: '😢', label: 'Sad', isCorrect: false }, { emoji: '😨', label: 'Scared', isCorrect: false }, { emoji: '😠', label: 'Angry', isCorrect: false }] },
];

interface EmotionDetectiveScreenProps {
  onBack: () => void;
}

export const EmotionDetectiveScreen: React.FC<EmotionDetectiveScreenProps> = ({ onBack }) => {
  const { speak } = useTTS();
  const { logActivity } = useUser ? useUser() : { logActivity: () => {} };

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'neutral' | 'correct' | 'wrong'>('neutral');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const mountFade = useRef(new Animated.Value(0)).current;
  const promptScale = useRef(new Animated.Value(0.8)).current;

  // Mount animation
  useEffect(() => {
    Animated.timing(mountFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    speak('Emotion Detective! Find the face that matches the feeling.');
    animatePrompt();
  }, []);

  const animatePrompt = () => {
    promptScale.setValue(0.8);
    Animated.spring(promptScale, {
      toValue: 1,
      tension: 40,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const resetGame = () => {
    setCurrentRound(0);
    setScore(0);
    setFeedback('neutral');
    setSelectedIdx(null);
    setGameComplete(false);
    animatePrompt();
  };

  const handleOptionPress = useCallback(
    (option: any, idx: number) => {
      // Prevent multiple clicks while checking
      if (feedback !== 'neutral') return;

      setSelectedIdx(idx);

      if (option.isCorrect) {
        setFeedback('correct');
        setScore((s) => s + 1);
        speak(`Yes! That's ${option.label}! Well done!`);

        setTimeout(() => {
          if (currentRound < ROUNDS.length - 1) {
            setCurrentRound((r) => r + 1);
            setFeedback('neutral');
            setSelectedIdx(null);
            animatePrompt();
          } else {
            setGameComplete(true);
            speak('Wonderful! You finished the Emotion Detective game!');
            logActivity('Emotion Detective', 3);
          }
        }, 1200);
      } else {
        setFeedback('wrong');
        speak(`That's ${option.label}. Try again!`);

        setTimeout(() => {
          setFeedback('neutral');
          setSelectedIdx(null);
        }, 800);
      }
    },
    [feedback, currentRound, speak, logActivity]
  );

  const round = ROUNDS[currentRound];
  const progressPercent = ((currentRound + (feedback === 'correct' ? 1 : 0)) / ROUNDS.length) * 100;

  return (
    <View style={styles.container}>
      {/* Short Deep Header Wrap */}
      <View style={styles.waveContainer}>
        <Svg height={240} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 240">
          <Defs>
            <LinearGradient id="edPlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primaryDeep} />
              <Stop offset="100%" stopColor={COLORS.primary} />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#edPlayGrad)"
            d="M0,0 L0,200 Q720,240 1440,200 L1440,0 Z"
          />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.headerArea, { opacity: mountFade }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <BackArrowIcon size={22} color={COLORS.textOnDark} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerStatsText}>
              {`ROUND ${currentRound + 1} OF ${ROUNDS.length}`}
            </Text>
            {/* Round completion bar */}
            <View style={styles.progressOuter}>
              <View style={[styles.progressInner, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </Animated.View>

        {/* Emotion Detective Play Space */}
        <Animated.View style={{ flex: 1, opacity: mountFade, paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg }}>
          
          {/* Enhanced Visually Distinct Prompt Card */}
          <Animated.View style={[styles.promptCard, { transform: [{ scale: promptScale }] }]}>
            <Text style={styles.promptLabel}>Find the face that looks...</Text>
            <Text style={styles.promptWord}>{round.prompt}</Text>
          </Animated.View>

          {/* 2x2 Emotion Grid Array */}
          <View style={styles.gridOuter}>
            {round.options.map((option, idx) => {
              const isSelected = selectedIdx === idx;
              // Pass down specific status for the pressed card
              let cardStatus: 'neutral' | 'correct' | 'wrong' = 'neutral';
              if (isSelected) {
                cardStatus = feedback;
              } else if (feedback === 'correct' && option.isCorrect) {
                 // Even if they didn't tap it, when correct happens we show green? 
                 // Actually they must tap it to hit correct.
                 cardStatus = 'correct'; 
              }

              return (
                <EmotionCard
                  key={`${currentRound}-${idx}`} // Force unmount/remount on new round for clean resets
                  emoji={option.emoji}
                  label={option.label}
                  disabled={feedback !== 'neutral'}
                  status={cardStatus}
                  onPress={() => handleOptionPress(option, idx)}
                />
              );
            })}
          </View>

          {/* Footer Motivational Fill */}
          <View style={styles.footerWrap}>
            <Text style={styles.footerTip}>Great job being an Emotion Detective! 🔍</Text>
          </View>

        </Animated.View>
      </SafeAreaView>

      {/* Modern Game Complete Overlay Modal */}
      <Modal visible={gameComplete} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🌟</Text>
            <Text style={styles.modalTitle}>Detective Star!</Text>
            <Text style={styles.modalSubtitle}>{`You identified ${score} out of ${ROUNDS.length} emotions correctly!`}</Text>

            <View style={styles.statsCard}>
               <View style={styles.statBox}>
                 <Text style={styles.statHighlight}>{`${score}/${ROUNDS.length}`}</Text>
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
              onPress={resetGame}
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
  },
  headerStatsText: {
    fontSize: TYPOGRAPHY.sizes.caption,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textOnDark,
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  progressOuter: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: RADII.full,
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    backgroundColor: COLORS.accentPink,
  },
  promptCard: {
    width: '100%',
    backgroundColor: '#8B5CF6', // Soft purple background per instructions
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...SHADOWS.elevated,
    shadowColor: '#8B5CF6',
  },
  promptLabel: {
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.semibold as any,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.xs,
  },
  promptWord: {
    fontSize: TYPOGRAPHY.sizes.hero,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textOnDark,
    textTransform: 'capitalize',
    letterSpacing: -1,
  },
  gridOuter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginLeft: -8, // offsets the card margins so the grid is centered perfectly
    marginRight: -8,
  },
  footerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerTip: {
    fontSize: TYPOGRAPHY.sizes.label,
    fontWeight: TYPOGRAPHY.weights.medium as any,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    opacity: 0.8,
  },
  // Modal Standardizations
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
    backgroundColor: COLORS.accentPink, // pink matching game theme
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

export default EmotionDetectiveScreen;
