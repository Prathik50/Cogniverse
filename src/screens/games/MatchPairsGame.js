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
import { useTheme } from '../../contexts/ThemeContext';
import { useTTS } from '../../contexts/TTSContext';
import { useUser } from '../../contexts/UserContext';
import { BackArrowIcon } from '../../components/icons/ConditionIcons';
import { MatchPairsDifficultyScreen } from '../../components/MatchPairsDifficultyScreen';

const { width } = Dimensions.get('window');

// Card emoji sets — simple, recognizable objects
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
  easy: { pairs: 2, cols: 2 },
  medium: { pairs: 3, cols: 3 },
  hard: { pairs: 4, cols: 4 },
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

// Individual Card component
const MemoryCard = ({ card, onPress, disabled }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: card.isFlipped || card.isMatched ? 1 : 0,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [card.isFlipped, card.isMatched]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
  const rotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  const CARD_SIZE = (width - 80) / 4;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || card.isFlipped || card.isMatched}
      activeOpacity={0.9}
      style={{ margin: 6 }}
    >
      <Animated.View style={[
        styles.card,
        { width: CARD_SIZE, height: CARD_SIZE + 10, transform: [{ scale: bounceAnim }] },
        card.isMatched && styles.cardMatched,
      ]}>
        {/* Back of card (question mark) */}
        <Animated.View style={[styles.cardFace, styles.cardBack, { opacity: backOpacity }]}>
          <Text style={styles.cardQuestionMark}>?</Text>
        </Animated.View>
        {/* Front of card (emoji) */}
        <Animated.View style={[styles.cardFace, styles.cardFront, { opacity: frontOpacity }]}>
          <Text style={[styles.cardEmoji, { fontSize: CARD_SIZE * 0.45 }]}>{card.emoji}</Text>
          <Text style={styles.cardLabel}>{card.label}</Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const MatchPairsGame = ({ onBack }) => {
  const { currentTheme } = useTheme();
  const { speak } = useTTS();
  const { logActivity } = useUser();

  const [difficulty, setDifficulty] = useState(null); // null = chooser, 'easy', 'medium'
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const startGame = useCallback((diff) => {
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
    speak(`Match Pairs game. ${diff} mode. Find all matching pairs!`);
  }, [speak]);

  const handleCardPress = useCallback((index) => {
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
        // Match found!
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

          if (newMatchCount === GRID_CONFIGS[difficulty].pairs) {
            setGameComplete(true);
            speak('Amazing! You found all the matches!');
            logActivity('Match Pairs Game', 2);
            Animated.spring(celebrateAnim, { toValue: 1, tension: 40, friction: 5, useNativeDriver: true }).start();
          }
        }, 500);
      } else {
        // No match — flip back
        setTimeout(() => {
          const reset = [...newCards];
          reset[first] = { ...reset[first], isFlipped: false };
          reset[second] = { ...reset[second], isFlipped: false };
          setCards(reset);
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [cards, flippedIndices, isChecking, matches, difficulty, speak, logActivity, celebrateAnim]);

  // Difficulty Chooser
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

  // Game Complete Overlay
  if (gameComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.waveContainer}>
          <Svg height={520} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <Defs>
              <LinearGradient id="mpDone" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#064E3B" />
                <Stop offset="100%" stopColor="#10B981" />
              </LinearGradient>
            </Defs>
            <Path fill="url(#mpDone)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
          </Svg>
        </View>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <Animated.View style={{ transform: [{ scale: celebrateAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }], alignItems: 'center' }}>
            <Text style={styles.celebrateEmoji}>🎉</Text>
            <Text style={styles.celebrateTitle}>Amazing Job!</Text>
            <Text style={styles.celebrateSubtitle}>You matched all {totalPairs} pairs in {moves} moves!</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalPairs}</Text>
                <Text style={styles.statLabel}>Pairs</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{moves}</Text>
                <Text style={styles.statLabel}>Moves</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                  {moves <= totalPairs + 2 ? '⭐⭐⭐' : moves <= totalPairs + 5 ? '⭐⭐' : '⭐'}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.playAgainBtn} onPress={() => startGame(difficulty)} activeOpacity={0.85}>
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

  // Game Board
  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={280} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="mpPlay" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#1E1B4B" />
              <Stop offset="100%" stopColor="#7C3AED" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#mpPlay)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={[styles.headerTop, { opacity: headerFade }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => setDifficulty(null)} activeOpacity={0.8}>
            <BackArrowIcon size={22} color="#7C3AED" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Match Pairs</Text>
            <Text style={styles.subtitleText}>{matches}/{totalPairs} Matched • {moves} Moves</Text>
          </View>
        </Animated.View>

        {/* Progress */}
        <View style={styles.progressOuter}>
          <View style={[styles.progressInner, { width: `${(matches / totalPairs) * 100}%` }]} />
        </View>

        {/* Game Grid */}
        <View style={styles.gridContainer}>
          <View style={[styles.grid, { flexWrap: 'wrap', width: (((width - 80) / config.cols) + 12) * config.cols }]}>
            {cards.map((card, idx) => (
              <MemoryCard
                key={card.id}
                card={card}
                onPress={() => handleCardPress(idx)}
                disabled={isChecking}
              />
            ))}
          </View>
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

  // Grid
  progressOuter: {
    height: 5, backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 24, marginTop: 14, borderRadius: 3, overflow: 'hidden',
  },
  progressInner: { height: '100%', borderRadius: 3, backgroundColor: '#A78BFA' },
  gridContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20 },
  grid: { flexDirection: 'row', justifyContent: 'center' },

  // Cards
  card: {
    borderRadius: 18, overflow: 'hidden',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 6,
  },
  cardMatched: { shadowColor: '#10B981', shadowOpacity: 0.3 },
  cardFace: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center', borderRadius: 18,
  },
  cardBack: { backgroundColor: '#7C3AED' },
  cardFront: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E2E8F0' },
  cardQuestionMark: { fontSize: 32, fontWeight: '900', color: 'rgba(255,255,255,0.7)' },
  cardEmoji: { marginBottom: 2 },
  cardLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', textAlign: 'center' },

  // Difficulty chooser
  chooserArea: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  chooserTitle: {
    fontSize: 30, fontWeight: '900', color: '#FFFFFF', textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
    marginBottom: 8,
  },
  chooserSubtitle: {
    fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center',
    marginBottom: 36, fontWeight: '500',
  },
  difficultyCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20,
    marginBottom: 18, borderWidth: 2,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },
  diffIconBox: {
    width: 56, height: 56, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  diffEmoji: { fontSize: 28 },
  diffContent: { flex: 1 },
  diffTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  diffDesc: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  diffArrow: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

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

export default MatchPairsGame;
