import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  BackHandler,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTTS } from '../contexts/TTSContext';

import HelpModal from './HelpModal';
import { BackArrowIcon, HelpIcon } from '../components/icons/ConditionIcons';

import MatchPairsGameScreen from './games/MatchPairsGameScreen';
import EmotionDetectiveScreen from './games/EmotionDetectiveScreen';
import CountAndTapScreen from './games/CountAndTapScreen';
import PatternPuzzleScreen from './games/PatternPuzzleScreen';

import { GameRow } from '../components/GameRow';
import { COLORS, TYPOGRAPHY, SPACING, RADII, SHADOWS } from '../theme/theme';

interface FunAndGamesScreenProps {
  onBack: () => void;
}

const GAMES = [
  { id: 'match-pairs' as const, title: 'Match Pairs', description: 'Find matching pairs to train memory and concentration.', emoji: '🧠', color: '#8B5CF6', benefit: 'Memory & Focus' },
  { id: 'emotion-detective' as const, title: 'Emotion Detective', description: 'Identify emotions from faces to build social awareness.', emoji: '🕵️', color: '#EC4899', benefit: 'Emotional Intelligence' },
  { id: 'count-and-tap' as const, title: 'Count & Tap', description: 'Count objects on screen and choose the right number.', emoji: '🎯', color: '#06B6D4', benefit: 'Numeracy Skills' },
  { id: 'pattern-puzzle' as const, title: 'Pattern Puzzle', description: 'Complete visual patterns to boost logical thinking.', emoji: '🧩', color: '#D946EF', benefit: 'Pattern Recognition', isNew: true },
];

type GameId = typeof GAMES[number]['id'];

export const FunAndGamesScreen: React.FC<FunAndGamesScreenProps> = ({ onBack }) => {
  const { speak } = useTTS();
  const [currentGame, setCurrentGame] = useState<GameId | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Layout Animations
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const fabBounce = useRef(new Animated.Value(100)).current;
  
  const rowAnims = useRef(
    GAMES.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(50),
    }))
  ).current;

  // Mount Animation Stagger
  useEffect(() => {
    // Header & Bounce FAB
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
      Animated.spring(fabBounce, { toValue: 0, tension: 50, friction: 5, delay: 600, useNativeDriver: true }),
    ]).start();

    // 80ms staggered slide up for game rows
    Animated.stagger(
      80,
      rowAnims.map(anim =>
        Animated.parallel([
          Animated.timing(anim.opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.spring(anim.translateY, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  // Hardware Back Handler
  useEffect(() => {
    const onHardwareBack = () => {
      if (showHelp) {
        setShowHelp(false);
        return true;
      }
      if (currentGame) {
        setCurrentGame(null);
        return true;
      }
      onBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBack);
  }, [currentGame, showHelp, onBack]);

  const handleGamePress = (gameId: GameId) => {
    const game = GAMES.find(g => g.id === gameId);
    if (game) speak(`Opening ${game.title}. ${game.description}`);
    setCurrentGame(gameId);
  };

  const handleBackToMenu = () => setCurrentGame(null);
  const handleHelpPress = () => {
    speak('Opening help');
    setShowHelp(true);
  };

  // Sub-routing for games
  if (currentGame === 'match-pairs') return <MatchPairsGameScreen onBack={handleBackToMenu} />;
  if (currentGame === 'emotion-detective') return <EmotionDetectiveScreen onBack={handleBackToMenu} />;
  if (currentGame === 'count-and-tap') return <CountAndTapScreen onBack={handleBackToMenu} />;
  if (currentGame === 'pattern-puzzle') return <PatternPuzzleScreen onBack={handleBackToMenu} />;

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={450} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="gamesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primaryDeep} />
              <Stop offset="30%" stopColor="#5B21B6" />
              <Stop offset="60%" stopColor="#7C3AED" />
              <Stop offset="100%" stopColor="#A78BFA" />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#gamesGrad)"
            d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.headerTop, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <BackArrowIcon size={22} color="#7C3AED" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title} accessibilityRole="header">Fun & Games</Text>
            <Text style={styles.subtitle}>Therapeutic Play</Text>
          </View>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.heroBanner, { opacity: headerOpacity }]}>
            <Text style={styles.heroTitle}>Play & Learn</Text>
            <Text style={styles.heroSubtitle}>
              Fun games designed to build memory, emotions, counting, and pattern skills.
            </Text>
          </Animated.View>

          <View style={styles.gamesList}>
            {GAMES.map((game, index) => (
              <Animated.View
                key={game.id}
                style={{
                  width: '100%',
                  opacity: rowAnims[index].opacity,
                  transform: [{ translateY: rowAnims[index].translateY }],
                }}
              >
                <GameRow
                  title={game.title}
                  description={game.description}
                  emoji={game.emoji}
                  accentColor={game.color}
                  benefit={game.benefit}
                  isNew={game.isNew}
                  isLast={index === GAMES.length - 1}
                  onPress={() => handleGamePress(game.id)}
                />
              </Animated.View>
            ))}
          </View>

          <Animated.View style={{ opacity: headerOpacity }}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>🌟 Why These Games?</Text>
              <Text style={styles.infoText}>
                Each game is carefully designed by child development experts to target specific skills that help children with autism and Down syndrome grow through play.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        <Animated.View style={[styles.fabContainer, { transform: [{ translateY: fabBounce }] }]}>
          <TouchableOpacity
            style={styles.helpFab}
            onPress={handleHelpPress}
            activeOpacity={0.85}
            accessibilityLabel="Help"
            accessibilityRole="button"
          >
            <View style={styles.helpFabInner}>
              <HelpIcon size={28} color={COLORS.textOnDark} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} context="games" />
      </SafeAreaView>
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.base,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: RADII.lg,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.elevated,
    shadowColor: COLORS.primaryDeep,
    shadowOpacity: 0.15,
  },
  headerTitles: {
    flex: 1,
    alignItems: 'center',
    marginRight: 44,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.h1,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textOnDark,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.caption,
    color: 'rgba(224,231,255,0.9)',
    fontWeight: TYPOGRAPHY.weights.semibold as any,
    marginTop: 3,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  heroBanner: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xs,
  },
  heroTitle: {
    fontSize: TYPOGRAPHY.sizes.hero - 4,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textOnDark,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    fontSize: TYPOGRAPHY.sizes.body,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: TYPOGRAPHY.weights.medium as any,
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  gamesList: {
    width: '100%',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(139,92,246,0.06)',
    borderRadius: RADII.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.12)',
    marginTop: SPACING.lg,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.extrabold as any,
    color: '#5B21B6',
    marginBottom: SPACING.sm + 2,
  },
  infoText: {
    fontSize: TYPOGRAPHY.sizes.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontWeight: TYPOGRAPHY.weights.medium as any,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: SPACING.xl,
  },
  helpFab: {
    ...SHADOWS.elevated,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.35,
  },
  helpFabInner: {
    width: 60,
    height: 60,
    borderRadius: RADII.lg,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FunAndGamesScreen;
