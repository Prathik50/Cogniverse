import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';
import { BackArrowIcon } from '../components/icons/ConditionIcons';
import { CategoryTab } from '../components/CategoryTab';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Animated Speaker SVG Icon
const AnimatedSpeakerIcon = ({ isPlaying, color }: { isPlaying: boolean, color: string }) => {
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.stagger(150, [
          Animated.sequence([
            Animated.timing(wave1, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(wave1, { toValue: 0, duration: 300, useNativeDriver: true })
          ]),
          Animated.sequence([
            Animated.timing(wave2, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(wave2, { toValue: 0, duration: 300, useNativeDriver: true })
          ]),
          Animated.sequence([
            Animated.timing(wave3, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(wave3, { toValue: 0, duration: 300, useNativeDriver: true })
          ]),
        ])
      ).start();
    } else {
      wave1.stopAnimation();
      wave2.stopAnimation();
      wave3.stopAnimation();
      wave1.setValue(0);
      wave2.setValue(0);
      wave3.setValue(0);
    }
  }, [isPlaying, wave1, wave2, wave3]);

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: 12 }}>
       <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill={color} />
       <AnimatedPath d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={wave1 as any} />
       <AnimatedPath d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={wave2 as any} />
    </Svg>
  );
};

// Core communication categories
const CATEGORIES = [
  { id: 'needs', label: 'I Need', emoji: '🙋', color: '#D94040' }, // Updated deeper red per user request
  { id: 'feelings', label: 'I Feel', emoji: '💛', color: '#F59E0B' },
  { id: 'actions', label: 'I Want To', emoji: '⭐', color: '#6366F1' },
  { id: 'people', label: 'People', emoji: '👨‍👩‍👧', color: '#10B981' },
  { id: 'responses', label: 'Responses', emoji: '💬', color: '#06B6D4' },
];

const CARDS = {
  needs: [
    { emoji: '🍽️', label: 'Eat', speech: 'I want to eat' },
    { emoji: '🥤', label: 'Drink', speech: 'I want a drink' },
    { emoji: '🚽', label: 'Toilet', speech: 'I need the toilet' },
    { emoji: '🆘', label: 'Help', speech: 'I need help' },
    { emoji: '😴', label: 'Rest', speech: 'I need to rest' },
    { emoji: '🤗', label: 'Hug', speech: 'I want a hug' },
  ],
  feelings: [
    { emoji: '😊', label: 'Happy', speech: 'I feel happy' },
    { emoji: '😢', label: 'Sad', speech: 'I feel sad' },
    { emoji: '😠', label: 'Angry', speech: 'I feel angry' },
    { emoji: '😨', label: 'Scared', speech: 'I feel scared' },
    { emoji: '🤒', label: 'Sick', speech: 'I feel sick' },
  ],
  actions: [
    { emoji: '🎮', label: 'Play', speech: 'I want to play' },
    { emoji: '📚', label: 'Read', speech: 'I want to read' },
    { emoji: '🚶', label: 'Walk', speech: 'I want to go for a walk' },
    { emoji: '🎵', label: 'Music', speech: 'I want to listen to music' },
  ],
  people: [
    { emoji: '👩', label: 'Mom', speech: 'I want mom' },
    { emoji: '👨', label: 'Dad', speech: 'I want dad' },
    { emoji: '👫', label: 'Friend', speech: 'I want my friend' },
    { emoji: '👩‍🏫', label: 'Teacher', speech: 'I want my teacher' },
  ],
  responses: [
    { emoji: '✅', label: 'Yes', speech: 'Yes' },
    { emoji: '❌', label: 'No', speech: 'No' },
    { emoji: '🙏', label: 'Please', speech: 'Please' },
    { emoji: '😊', label: 'Thank You', speech: 'Thank you' },
  ],
};

export const MyVoiceScreen = ({ onBack }: { onBack: () => void }) => {
  const { speak } = useTTS();
  const { logActivity } = useUser ? useUser() : { logActivity: () => {} };

  const [selectedCategory, setSelectedCategory] = useState('needs');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const headerFade = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // TypeScript assertion mappings securely fallback empty object if id isn't populated
  const currentCards = CARDS[selectedCategory as keyof typeof CARDS] || [];
  const card = currentCards[currentIndex];
  // Safe map fallback
  const catObj = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];
  const accentColor = catObj.color;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    triggerEntranceAnim();
  }, []);

  const triggerEntranceAnim = () => {
    cardScale.setValue(0.9);
    cardOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handleCategoryChange = (catId: string) => {
    if (selectedCategory === catId) return;
    Animated.parallel([
       Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
       Animated.timing(cardScale, { toValue: 0.95, duration: 200, useNativeDriver: true })
    ]).start(() => {
       setSelectedCategory(catId);
       setCurrentIndex(0);
       triggerEntranceAnim();
    });
  };

  const handleNext = () => {
    const nextIdx = currentIndex < currentCards.length - 1 ? currentIndex + 1 : 0;
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 0.95, duration: 150, useNativeDriver: true })
    ]).start(() => {
      setCurrentIndex(nextIdx);
      triggerEntranceAnim();
    });
  };

  const handlePrev = () => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : currentCards.length - 1;
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 0.95, duration: 150, useNativeDriver: true })
    ]).start(() => {
      setCurrentIndex(prevIdx);
      triggerEntranceAnim();
    });
  };

  const handleSpeak = () => {
    if (card) {
      setIsPlaying(true);
      speak(card.speech);
      logActivity('Communication Board', 1);
      setTimeout(() => setIsPlaying(false), 2500); // 2.5s simulated TTS active time
    }
  };

  if (!card) return null;

  return (
    <View style={styles.container}>
      {/* Background Header SVG matching category color natively */}
      <View style={styles.waveContainer}>
        <Svg height={350} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="myVoiceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
               <Stop offset="0%" stopColor={COLORS.primaryDeep} />
               <Stop offset="50%" stopColor={accentColor + 'E6'} />
               <Stop offset="100%" stopColor={accentColor} />
            </LinearGradient>
          </Defs>
          <Path fill="url(#myVoiceGrad)" d="M0,250L48,240C96,230,192,210,288,210C384,210,480,230,576,230C672,230,768,210,864,195C960,180,1056,170,1152,175C1248,180,1344,200,1392,210L1440,220L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Row */}
        <Animated.View style={[styles.headerTop, { opacity: headerFade }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <BackArrowIcon size={22} color={accentColor} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>My Voice</Text>
            <Text style={styles.subtitleText}>{catObj.label} • {currentIndex + 1} of {currentCards.length}</Text>
          </View>
        </Animated.View>

        {/* Scrollable Category Tabs */}
        <View style={styles.categoryArea}>
           <ScrollView 
             horizontal 
             showsHorizontalScrollIndicator={false} 
             contentContainerStyle={styles.categoryScrollContent}
           >
              {CATEGORIES.map(cat => (
                 <CategoryTab 
                   key={cat.id}
                   id={cat.id}
                   label={cat.label}
                   emoji={cat.emoji}
                   color={cat.color}
                   isActive={selectedCategory === cat.id}
                   onPress={() => handleCategoryChange(cat.id)}
                 />
              ))}
           </ScrollView>
        </View>

        {/* Main Flashcard Layout Container */}
        <View style={styles.cardArea}>
           <Animated.View style={[
              styles.bigCard, 
              { 
                opacity: cardOpacity, 
                transform: [{ scale: cardScale }],
                shadowColor: accentColor
              }
           ]}>
              <View style={[styles.emojiCircle, { backgroundColor: accentColor + '15' }]}>
                 <Text style={styles.bigEmoji}>{card.emoji}</Text>
              </View>

              <Text style={styles.cardLabel}>{card.label}</Text>

              {/* Styled Prominent Quotes Pill */}
              <View style={[styles.quotePill, { borderColor: accentColor }]}>
                 <Text style={[styles.quoteText, { color: COLORS.textPrimary }]}>
                    "{card.speech}"
                 </Text>
              </View>

              <TouchableOpacity 
                style={[styles.voiceButton, { backgroundColor: accentColor }]} 
                onPress={handleSpeak}
                activeOpacity={0.85}
              >
                 <AnimatedSpeakerIcon isPlaying={isPlaying} color="#FFF" />
                 <Text style={styles.voiceButtonText}>Speak</Text>
              </TouchableOpacity>
           </Animated.View>
        </View>

        {/* Bottom Nav Row */}
        <View style={styles.navRow}>
           <TouchableOpacity 
             style={[styles.navBtn, { borderColor: accentColor }]} 
             onPress={handlePrev}
             activeOpacity={0.8}
           >
             <Text style={[styles.navBtnText, { color: accentColor }]}>Back</Text>
           </TouchableOpacity>

           {/* Paginated Dots */}
           <View style={styles.dotsRow}>
              {currentCards.map((_, i) => (
                 <View key={i} style={[
                    styles.dot,
                    i === currentIndex && { backgroundColor: accentColor, width: 22, height: 10 }
                 ]} />
              ))}
           </View>

           <TouchableOpacity 
             style={[styles.navBtn, { backgroundColor: accentColor, borderColor: accentColor }]} 
             onPress={handleNext}
             activeOpacity={0.8}
           >
             <Text style={[styles.navBtnText, { color: COLORS.textOnDark }]}>Next</Text>
           </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: RADII.lg,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
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
  },
  subtitleText: {
    fontSize: TYPOGRAPHY.sizes.caption,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: TYPOGRAPHY.weights.bold as any,
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  categoryArea: {
    height: 60,
    marginTop: SPACING.md,
  },
  categoryScrollContent: {
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    paddingRight: SPACING.xxl, // Ensures the 4th tab is explicitly accessible when scrolling
  },

  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  bigCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    width: '100%',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.20,
    shadowRadius: 36,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  emojiCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  bigEmoji: {
    fontSize: 85,
  },
  cardLabel: {
    fontSize: TYPOGRAPHY.sizes.hero,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: '#1E293B',
    marginBottom: SPACING.md,
  },
  quotePill: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADII.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderWidth: 2,
    marginBottom: SPACING.xxl,
  },
  quoteText: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.bold as any,
    fontStyle: 'italic',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADII.xl,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    ...SHADOWS.elevated,
  },
  voiceButtonText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.sizes.h2,
    fontWeight: TYPOGRAPHY.weights.black as any,
    letterSpacing: 0.5,
  },

  // Navigation Pill Targets Bottom Layout
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl + 10,
    paddingTop: SPACING.md,
  },
  navBtn: {
    minWidth: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADII.full,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 2.5,
    ...SHADOWS.card,
  },
  navBtnText: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.bold as any,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
});

export default MyVoiceScreen;
