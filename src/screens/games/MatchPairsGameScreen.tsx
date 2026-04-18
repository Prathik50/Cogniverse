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
import { MatchPairsDifficultyScreen } from '../../components/MatchPairsDifficultyScreen';
import { FlipCard } from '../../components/FlipCard';
import { COLORS, TYPOGRAPHY, SPACING, RADII, SHADOWS } from '../../theme/theme';

const { width } = Dimensions.get('window');

// ── Game Data Configs ──
const CARD_SETS = {
  easy: [
    { emoji: '🌟', label: 'Star' },
    { emoji: '❤️', label: 'Heart' },
  ],
  medium: [
    { emoji: '🍎', label: 'Apple' },
    { emoji: '🐱', label: 'Cat' },
    { emoji: '🌻', label: 'Sunflower' },
  ],
  hard: [
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '🍕', label: 'Pizza' },
    { emoji: '🎈', label: 'Balloon' },
    { emoji: '🎸', label: 'Guitar' },
  ],
};

const GRID_CONFIGS = {
  easy: { pairs: 2, cols: 2 },    // 4 cards (2 cols x 2 rows)
  medium: { pairs: 3, cols: 2 },  // 6 cards (2 cols x 3 rows is symmetrical)
  hard: { pairs: 4, cols: 2 },    // 8 cards (2 cols x 4 rows)
};

const shuffle = (arr: any[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

interface MatchPairsGameScreenProps {
  onBack: () => void;
}

export const MatchPairsGameScreen: React.FC<MatchPairsGameScreenProps> = ({ onBack }) => {
  const { speak } = useTTS();
  const { logActivity } = useUser ? useUser() : { logActivity: () => {} };

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  
  const [isChecking, setIsChecking] = useState(false);
  const [isWrongMatch, setIsWrongMatch] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (difficulty) {
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }
  }, [difficulty]);

  const startGame = useCallback((diff: 'easy' | 'medium' | 'hard') => {
    const config = GRID_CONFIGS[diff];
    const set = CARD_SETS[diff].slice(0, config.pairs);
    const deck = shuffle([...set, ...set].map((item, i) => ({
      id: i,
      emoji: item.emoji,
      label: item.label,
      isFlipped: false,
      isMatched: false,
    })));
    
    setCards(deck);
    setFlippedIndices([]);
    setMatches(0);
    setMoves(0);
    setGameComplete(false);
    setDifficulty(diff);
    setIsWrongMatch(false);
    speak(`Match Pairs game. ${diff} mode. Find all matching pairs!`);
  }, [speak]);

  const handleCardPress = useCallback((index: number) => {
    if (isChecking || flippedIndices.length >= 2) return;

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], isFlipped: true };
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    speak(newCards[index].label);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves(m => m + 1);

      const [first, second] = newFlipped;
      if (newCards[first].emoji === newCards[second].emoji) {
        // MATCH: Apply success state
        setTimeout(() => {
          const matched = [...newCards];
          matched[first] = { ...matched[first], isMatched: true };
          matched[second] = { ...matched[second], isMatched: true };
          setCards(matched);
          setFlippedIndices([]);
          setIsChecking(false);

          const newMatchCount = matches + 1;
          setMatches(newMatchCount);
          speak('Great match!');

          if (newMatchCount === GRID_CONFIGS[difficulty!].pairs) {
            setTimeout(() => {
              setGameComplete(true);
              speak('Amazing! You found all the matches!');
              logActivity('Match Pairs Game', 2);
            }, 600);
          }
        }, 500); // Small pause so user sees both cards matched
      } else {
        // NO MATCH: Apply shaker and wait 1s before reverting flip
        setIsWrongMatch(true); // Triggers shake animation in FlipCard component
        setTimeout(() => {
          const reset = [...newCards];
          reset[first] = { ...reset[first], isFlipped: false };
          reset[second] = { ...reset[second], isFlipped: false };
          setCards(reset);
          setFlippedIndices([]);
          setIsChecking(false);
          setIsWrongMatch(false);
        }, 1000);
      }
    }
  }, [cards, flippedIndices, isChecking, matches, difficulty, speak, logActivity]);

  // Handle exiting out to difficulty chooser
  const handleExitToChooser = () => {
    setDifficulty(null);
  };

  if (!difficulty) {
    return (
      <MatchPairsDifficultyScreen
        onBack={onBack}
        onSelectDifficulty={(diff) => startGame(diff)}
      />
    );
  }

  const config = GRID_CONFIGS[difficulty];
  const totalPairs = config.pairs;
  const progressPercent = (matches / totalPairs) * 100;

  return (
    <View style={styles.container}>
      {/* Short Top Header Wrap using Primary Gradient */}
      <View style={styles.waveContainer}>
        <Svg height={220} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 220">
          <Defs>
            <LinearGradient id="mpPlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primaryDeep} />
              <Stop offset="50%" stopColor={COLORS.primary} />
              <Stop offset="100%" stopColor={COLORS.primaryLight} />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#mpPlayGrad)"
            d="M0,0 L0,180 Q720,220 1440,180 L1440,0 Z"
          />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.headerArea, { opacity: headerFade }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleExitToChooser} activeOpacity={0.8}>
            <BackArrowIcon size={22} color={COLORS.textOnDark} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerStatsText}>
              {`${matches}/${totalPairs} MATCHED • ${moves} MOVES`}
            </Text>
            {/* Dynamic Real-time Progress Bar */}
            <View style={styles.progressOuter}>
              <View style={[styles.progressInner, { width: `${progressPercent}%` }]} />
            </View>
          </View>
        </Animated.View>

        {/* Guaranteed perfectly symmetrical grid mapping using specified cols */}
        <View style={styles.gridOuter}>
           <View style={[
              styles.gridInnerContainer, 
              // Hard-coding width mathematically to force neat wrap 
              // Math maps roughly identically to the FlipCard calculations
              { width: (((width - 80) / config.cols) + 12) * config.cols } 
            ]}>
             {cards.map((card, idx) => {
               // Check if this specific card is active inside the "wrong match" check window
               const isCardWrong = isWrongMatch && flippedIndices.includes(idx);
               return (
                 <FlipCard
                   key={card.id}
                   card={card}
                   onPress={() => handleCardPress(idx)}
                   disabled={isChecking}
                   cols={config.cols}
                   isWrong={isCardWrong}
                 />
               );
             })}
           </View>
        </View>
      </SafeAreaView>

      {/* Modern Game Complete Overlay Modal */}
      <Modal visible={gameComplete} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>Level Complete!</Text>
            <Text style={styles.modalSubtitle}>Amazing memory work!</Text>

            <View style={styles.statsCard}>
               <View style={styles.statBox}>
                 <Text style={styles.statHighlight}>{totalPairs}</Text>
                 <Text style={styles.statLabel}>Pairs</Text>
               </View>
               <View style={styles.statDivider} />
               <View style={styles.statBox}>
                 <Text style={styles.statHighlight}>{moves}</Text>
                 <Text style={styles.statLabel}>Moves</Text>
               </View>
            </View>

            <TouchableOpacity 
              style={styles.playAgainBtn} 
              activeOpacity={0.8}
              onPress={() => startGame(difficulty)}
            >
              <Text style={styles.playAgainTxt}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.changeModeBtn} 
              activeOpacity={0.8}
              onPress={handleExitToChooser}
            >
              <Text style={styles.changeModeTxt}>Change Difficulty</Text>
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
    backgroundColor: COLORS.accentTeal,
  },
  gridOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridInnerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
    backgroundColor: COLORS.primary,
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

export default MatchPairsGameScreen;
