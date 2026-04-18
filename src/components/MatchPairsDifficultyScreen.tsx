import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { BackArrowIcon } from './icons/ConditionIcons';
import { DifficultyCard } from './DifficultyCard';
import { COLORS, TYPOGRAPHY, SPACING, RADII, SHADOWS } from '../theme/theme';

interface MatchPairsDifficultyScreenProps {
  onBack: () => void;
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const MatchPairsDifficultyScreen: React.FC<MatchPairsDifficultyScreenProps> = ({
  onBack,
  onSelectDifficulty,
}) => {
  const mountAnim = useRef(new Animated.Value(0)).current;
  const slideAnims = useRef(
    [0, 1, 2].map(() => new Animated.Value(50))
  ).current;

  // Mount animation for cards
  useEffect(() => {
    Animated.timing(mountAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      100,
      slideAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Wave Background with controlled height so it doesn't overlap text awkwardly */}
      <View style={styles.waveContainer}>
        <Svg height={260} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="diffGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.primaryDeep} />
              <Stop offset="50%" stopColor={COLORS.primaryDark} />
              <Stop offset="100%" stopColor={COLORS.primaryLight} />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#diffGrad)"
            d="M0,0 L0,220 Q720,320 1440,220 L1440,0 Z"
          />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header - Raised above wave utilizing proper padding and layout hierarchy */}
        <Animated.View style={[styles.headerTop, { opacity: mountAnim }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <BackArrowIcon size={24} color={COLORS.textOnDark} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.contentArea}>
          <Animated.View style={{ opacity: mountAnim, marginBottom: SPACING.xl }}>
            <Text style={styles.suptitle}>MEMORY GAME</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.title}>Choose Difficulty</Text>
              <Text style={styles.titleEmoji}> 🧠</Text>
            </View>
            <Text style={styles.description}>Pick a level that feels comfortable. Start with Easy to warm up!</Text>
          </Animated.View>

          <View style={styles.cardsWrapper}>
            <Animated.View style={{ opacity: mountAnim, transform: [{ translateY: slideAnims[0] }] }}>
              <DifficultyCard
                difficulty="Easy"
                subtitle="2 pairs • 4 cards • Great start!"
                emoji="🌟"
                accentColor={COLORS.accentGreen}
                onPress={() => onSelectDifficulty('easy')}
              />
            </Animated.View>

            <Animated.View style={{ opacity: mountAnim, transform: [{ translateY: slideAnims[1] }] }}>
              <DifficultyCard
                difficulty="Medium"
                subtitle="3 pairs • 6 cards • A bit more fun!"
                emoji="🔥"
                accentColor={COLORS.accentOrange}
                onPress={() => onSelectDifficulty('medium')}
              />
            </Animated.View>

            <Animated.View style={{ opacity: mountAnim, transform: [{ translateY: slideAnims[2] }] }}>
              <DifficultyCard
                difficulty="Hard"
                subtitle="4 pairs • 8 cards • A real challenge!"
                emoji="🚀"
                accentColor="#EF4444" // Error Red
                onPress={() => onSelectDifficulty('hard')}
              />
            </Animated.View>
          </View>
        </View>
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
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md, // Brings title text cleanly above the white card container area below the header
    zIndex: 10,
  },
  suptitle: {
    fontSize: TYPOGRAPHY.sizes.caption,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.h1,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textOnDark,
    letterSpacing: -0.5,
  },
  titleEmoji: {
    fontSize: 32,
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.medium as any,
    color: 'rgba(255,255,255,0.95)',
    marginTop: SPACING.sm,
    lineHeight: 22,
    maxWidth: '90%',
  },
  cardsWrapper: {
    marginTop: SPACING.lg,
  },
});
