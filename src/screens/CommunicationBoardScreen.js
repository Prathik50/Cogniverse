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

const { width } = Dimensions.get('window');

// Floating orb for visual ambience
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

// Core communication categories
const CATEGORIES = [
  { id: 'needs', label: 'I Need', emoji: '🙋', color: '#EF4444' },
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
    { emoji: '🧸', label: 'Toy', speech: 'I want my toy' },
    { emoji: '🏠', label: 'Home', speech: 'I want to go home' },
  ],
  feelings: [
    { emoji: '😊', label: 'Happy', speech: 'I feel happy' },
    { emoji: '😢', label: 'Sad', speech: 'I feel sad' },
    { emoji: '😠', label: 'Angry', speech: 'I feel angry' },
    { emoji: '😨', label: 'Scared', speech: 'I feel scared' },
    { emoji: '🤒', label: 'Sick', speech: 'I feel sick' },
    { emoji: '😫', label: 'Tired', speech: 'I feel tired' },
    { emoji: '😊', label: 'Good', speech: 'I feel good' },
    { emoji: '🥰', label: 'Loved', speech: 'I feel loved' },
  ],
  actions: [
    { emoji: '🎮', label: 'Play', speech: 'I want to play' },
    { emoji: '📚', label: 'Read', speech: 'I want to read' },
    { emoji: '🚶', label: 'Walk', speech: 'I want to go for a walk' },
    { emoji: '🎵', label: 'Music', speech: 'I want to listen to music' },
    { emoji: '📺', label: 'Watch', speech: 'I want to watch something' },
    { emoji: '✏️', label: 'Draw', speech: 'I want to draw' },
  ],
  people: [
    { emoji: '👩', label: 'Mom', speech: 'I want mom' },
    { emoji: '👨', label: 'Dad', speech: 'I want dad' },
    { emoji: '👫', label: 'Friend', speech: 'I want my friend' },
    { emoji: '👩‍🏫', label: 'Teacher', speech: 'I want my teacher' },
    { emoji: '👨‍👩‍👧', label: 'Family', speech: 'I want my family' },
    { emoji: '🧑‍⚕️', label: 'Doctor', speech: 'I want the doctor' },
  ],
  responses: [
    { emoji: '✅', label: 'Yes', speech: 'Yes' },
    { emoji: '❌', label: 'No', speech: 'No' },
    { emoji: '🙏', label: 'Please', speech: 'Please' },
    { emoji: '😊', label: 'Thank You', speech: 'Thank you' },
    { emoji: '👋', label: 'Hello', speech: 'Hello' },
    { emoji: '🤝', label: 'Goodbye', speech: 'Goodbye' },
    { emoji: '😞', label: 'Sorry', speech: 'I am sorry' },
    { emoji: '🔄', label: 'Again', speech: 'Again please' },
  ],
};

const CommunicationBoardScreen = ({ onBack }) => {
  const { speak } = useTTS();
  const { logActivity } = useUser();

  const [selectedCategory, setSelectedCategory] = useState('needs');
  const [currentIndex, setCurrentIndex] = useState(0);

  const headerFade = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const currentCards = CARDS[selectedCategory] || [];
  const card = currentCards[currentIndex];
  const catObj = CATEGORIES.find(c => c.id === selectedCategory);
  const accentColor = catObj?.color || '#6366F1';

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    animateCard();
  }, []);

  const animateCard = () => {
    cardScale.setValue(0.85);
    cardOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentIndex(0);
    // Animate the new card in
    cardScale.setValue(0.85);
    cardOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  const handleNext = () => {
    const cards = CARDS[selectedCategory];
    const nextIdx = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
    Animated.parallel([
      Animated.timing(cardScale, { toValue: 0.85, duration: 180, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex(nextIdx);
      animateCard();
    });
  };

  const handlePrev = () => {
    const cards = CARDS[selectedCategory];
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
    Animated.parallel([
      Animated.timing(cardScale, { toValue: 0.85, duration: 180, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex(prevIdx);
      animateCard();
    });
  };

  const handleSpeak = () => {
    if (card) {
      speak(card.speech);
      logActivity('Communication Board', 1);
    }
  };

  if (!card) return null;

  const progress = ((currentIndex + 1) / currentCards.length) * 100;

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.waveContainer}>
        <Svg height={520} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="cbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#1E1B4B" />
              <Stop offset="40%" stopColor={accentColor + 'CC'} />
              <Stop offset="100%" stopColor={accentColor} />
            </LinearGradient>
          </Defs>
          <Path fill="url(#cbGrad)" d="M0,294L48,272.7C96,251,192,209,288,208.7C384,209,480,251,576,262C672,273,768,251,864,224.7C960,198,1056,166,1152,160.7C1248,155,1344,177,1392,187.3L1440,198L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <FloatingOrb size={70} color={accentColor + '18'} top={60} left={width - 90} delay={0} />
      <FloatingOrb size={45} color={accentColor + '20'} top={120} left={20} delay={300} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <Animated.View style={[styles.headerTop, { opacity: headerFade }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <BackArrowIcon size={22} color={accentColor} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>My Voice</Text>
            <Text style={styles.subtitleText}>{catObj?.label} · {currentIndex + 1} of {currentCards.length}</Text>
          </View>
        </Animated.View>

        {/* Category tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id}
              style={[
                styles.categoryTab,
                selectedCategory === cat.id && { backgroundColor: cat.color, borderColor: cat.color },
              ]}
              onPress={() => handleCategoryChange(cat.id)} activeOpacity={0.85}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={[
                styles.categoryLabel,
                selectedCategory === cat.id && { color: '#FFFFFF' },
              ]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Progress bar */}
        <View style={styles.progressOuter}>
          <View style={[styles.progressInner, { width: `${progress}%`, backgroundColor: accentColor }]} />
        </View>

        {/* Main Card — one at a time */}
        <View style={styles.cardArea}>
          <Animated.View style={[styles.bigCard, {
            opacity: cardOpacity,
            transform: [{ scale: cardScale }],
            shadowColor: accentColor,
          }]}>
            {/* Big emoji */}
            <View style={[styles.emojiCircle, { backgroundColor: accentColor + '12' }]}>
              <Text style={styles.bigEmoji}>{card.emoji}</Text>
            </View>

            {/* Label */}
            <Text style={styles.cardLabel}>{card.label}</Text>

            {/* Speech preview */}
            <View style={[styles.speechBadge, { backgroundColor: accentColor + '10' }]}>
              <Text style={[styles.speechText, { color: accentColor }]}>"{card.speech}"</Text>
            </View>

            {/* Voice button */}
            <TouchableOpacity
              style={[styles.voiceButton, { backgroundColor: accentColor }]}
              onPress={handleSpeak}
              activeOpacity={0.85}
            >
              <Text style={styles.voiceButtonText}>🔊  Speak</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navBtn} onPress={handlePrev} activeOpacity={0.85}>
            <Text style={styles.navBtnText}>← Back</Text>
          </TouchableOpacity>

          {/* Dot indicators */}
          <View style={styles.dots}>
            {currentCards.map((_, i) => (
              <View key={i} style={[
                styles.dot,
                i === currentIndex && { backgroundColor: accentColor, width: 20 },
              ]} />
            ))}
          </View>

          <TouchableOpacity style={[styles.navBtn, styles.nextBtn, { backgroundColor: accentColor }]}
            onPress={handleNext} activeOpacity={0.85}>
            <Text style={[styles.navBtnText, { color: '#FFFFFF' }]}>
              {currentIndex < currentCards.length - 1 ? 'Next →' : 'Start Over ↻'}
            </Text>
          </TouchableOpacity>
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
    marginTop: 3, letterSpacing: 0.8, textTransform: 'uppercase',
  },

  // Categories
  categoryScroll: { maxHeight: 56, marginTop: 14 },
  categoryContent: { paddingHorizontal: 16 },
  categoryTab: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 28, paddingHorizontal: 16,
    paddingVertical: 10, marginHorizontal: 5,
    borderWidth: 2, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  categoryEmoji: { fontSize: 18, marginRight: 6 },
  categoryLabel: { fontSize: 13, fontWeight: '700', color: '#334155' },

  // Progress
  progressOuter: {
    height: 5, backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 24, marginTop: 14, borderRadius: 3, overflow: 'hidden',
  },
  progressInner: { height: '100%', borderRadius: 3 },

  // Card area
  cardArea: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24,
  },
  bigCard: {
    backgroundColor: '#FFFFFF', borderRadius: 36, padding: 36,
    alignItems: 'center', width: '100%',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15, shadowRadius: 30, elevation: 16,
  },
  emojiCircle: {
    width: 140, height: 140, borderRadius: 70,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  bigEmoji: { fontSize: 80 },
  cardLabel: {
    fontSize: 32, fontWeight: '900', color: '#1E293B',
    letterSpacing: -0.5, marginBottom: 10, textAlign: 'center',
  },
  speechBadge: {
    borderRadius: 16, paddingHorizontal: 20, paddingVertical: 10,
    marginBottom: 24,
  },
  speechText: { fontSize: 15, fontWeight: '700', textAlign: 'center', fontStyle: 'italic' },
  voiceButton: {
    borderRadius: 22, paddingHorizontal: 40, paddingVertical: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 14, elevation: 8,
  },
  voiceButtonText: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },

  // Navigation
  navRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingBottom: 30, paddingTop: 16,
  },
  navBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 18,
    paddingHorizontal: 22, paddingVertical: 14,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  nextBtn: {
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  navBtnText: { fontSize: 15, fontWeight: '800', color: '#334155' },

  // Dots
  dots: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#CBD5E1', marginHorizontal: 3,
  },
});

export default CommunicationBoardScreen;
