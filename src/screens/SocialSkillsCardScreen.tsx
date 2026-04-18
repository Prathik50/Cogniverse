import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
  Easing,
  AccessibilityInfo,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTTS } from '../contexts/TTSContext';
import { useUser } from '../contexts/UserContext';
import { BackArrowIcon } from '../components/icons/ConditionIcons';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../theme/theme';

const { width, height } = Dimensions.get('window');

// ── DATA ──
const SOCIAL_CARDS = [
  { emoji: '👋', title: 'Hello!', speech: 'We say Hello when we meet someone. Wave your hand and smile!', tip: 'Wave your hand and smile', color: '#6366F1' },
  { emoji: '🤝', title: 'Shaking Hands', speech: 'We shake hands when we greet someone. Hold out your hand and gently shake.', tip: 'Hold out your hand gently', color: '#10B981' },
  { emoji: '🙏', title: 'Thank You', speech: 'We say Thank You when someone does something nice for us. It makes them feel good!', tip: 'Say it when someone helps you', color: '#F59E0B' },
  { emoji: '😊', title: 'Smiling', speech: 'A smile shows people you are friendly. Try smiling when you see someone!', tip: 'Smile to show you are friendly', color: '#EC4899' },
  { emoji: '👀', title: 'Eye Contact', speech: 'Looking at someone when they talk shows you are listening. Try looking at their eyes or nose.', tip: 'Look at their eyes or nose', color: '#8B5CF6' },
  { emoji: '🙋', title: 'Asking for Help', speech: 'When you need help, raise your hand or say Excuse me, can you help me please?', tip: 'Say: Can you help me please?', color: '#EF4444' },
  { emoji: '🤗', title: 'Hugging', speech: 'We hug people we love, like mom and dad. Always ask first: Can I have a hug?', tip: 'Always ask before hugging', color: '#F97316' },
  { emoji: '👂', title: 'Listening', speech: 'Good listening means being quiet when someone is talking and looking at them.', tip: 'Be quiet and look at them', color: '#06B6D4' },
  { emoji: '🙇', title: 'Sorry', speech: 'We say Sorry when we make a mistake or hurt someone. It helps fix things.', tip: 'Say it when you make a mistake', color: '#64748B' },
  { emoji: '👋🏼', title: 'Goodbye', speech: 'We say Goodbye when someone is leaving. Wave and say See you later!', tip: 'Wave and say: See you later!', color: '#7C3AED' },
  { emoji: '🤲', title: 'Sharing', speech: 'Sharing means giving some of what you have to others. It makes everyone happy!', tip: 'Give some to a friend', color: '#059669' },
  { emoji: '⏳', title: 'Waiting Your Turn', speech: 'Sometimes we have to wait. Stand calmly and wait for your turn. You will get a chance!', tip: 'Stand calmly and be patient', color: '#D97706' },
];

// ── COMPONENTS ──

// Decorative Floating ORB (A11y Hidden & Safe Animation Cleanup)
const FloatingOrb = ({ size, color, top, left, delay = 0 }: { size: number, color: string, top: number, left: number, delay?: number }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 1000, delay, useNativeDriver: true }).start();
    const anim = Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0, duration: 3000 + delay, useNativeDriver: true }),
    ]));
    anim.start();

    return () => {
      anim.stop(); // Safe cleanup on unmount
    };
  }, [delay, floatAnim, opacityAnim]);
  
  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  return (
    <Animated.View
      style={{ position: 'absolute', top, left, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: opacityAnim, transform: [{ translateY }] }}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden={true}
    />
  );
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Animated Speaker SVG Icon
const AnimatedSpeakerIcon = ({ isPlaying, color }: { isPlaying: boolean, color: string }) => {
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let anim: Animated.CompositeAnimation | null = null;
    if (isPlaying) {
      anim = Animated.loop(
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
      );
      anim.start();
    } else {
      wave1.stopAnimation();
      wave2.stopAnimation();
      wave3.stopAnimation();
      wave1.setValue(0);
      wave2.setValue(0);
      wave3.setValue(0);
    }
    return () => {
      if (anim) anim.stop();
    };
  }, [isPlaying, wave1, wave2, wave3]);

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: 12 }}>
       <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill="#FFF" />
       <AnimatedPath d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={wave1 as any} />
       <AnimatedPath d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={wave2 as any} />
    </Svg>
  );
};

// ── MAIN SCREEN COMPONENT ──
export const SocialSkillsCardScreen = ({ onBack }: { onBack: () => void }) => {
  const { speak } = useTTS();
  
  // Safely extract hook context values, unconditionally calling the hook with a fallback
  const userContext = useUser();
  const logActivity = userContext?.logActivity || (() => {});

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Layout Animations
  const slideAnim = useRef(new Animated.Value(0)).current; 
  const progressAnim = useRef(new Animated.Value(0)).current;

  const card = SOCIAL_CARDS[currentIndex];

  useEffect(() => {
    // Initial mount progress
    Animated.timing(progressAnim, { 
      toValue: ((currentIndex + 1) / SOCIAL_CARDS.length) * 100, 
      duration: 600, 
      useNativeDriver: false // Must be false for width animation
    }).start();

    // Android Hardware back handler
    const onHardwareBack = () => { onBack(); return true; };
    BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => BackHandler.removeEventListener('hardwareBackPress', onHardwareBack);
  }, [onBack, currentIndex, progressAnim]);

  // Slide Animation Engine
  const slideCard = useCallback((direction: 'next' | 'prev') => {
    const nextIdx = direction === 'next' 
      ? (currentIndex < SOCIAL_CARDS.length - 1 ? currentIndex + 1 : 0)
      : (currentIndex > 0 ? currentIndex - 1 : SOCIAL_CARDS.length - 1);

    // Announce to screen readers
    AccessibilityInfo.announceForAccessibility(`Now showing ${SOCIAL_CARDS[nextIdx].title}`);

    // Slide out
    Animated.timing(slideAnim, {
      toValue: direction === 'next' ? -width : width,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(nextIdx);
      if (direction === 'next') logActivity('Social Skills', 1);

      // Snap to opposite side smoothly before sliding in
      slideAnim.setValue(direction === 'next' ? width : -width);

      // Trigger Progress Bar dynamically linked to the newly set state layout
      Animated.spring(progressAnim, {
         toValue: ((nextIdx + 1) / SOCIAL_CARDS.length) * 100,
         useNativeDriver: false, // width adjustments can't track natively
         tension: 40,
         friction: 8
      }).start();

      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  }, [currentIndex, slideAnim, progressAnim, logActivity]);

  const handleSpeak = useCallback(() => {
    setIsPlaying(true);
    speak(`${card.title}. ${card.speech}`);
    // Simulate audio duration visual based on length of text as a rough proxy
    const duration = Math.max(3000, card.speech.length * 80);
    setTimeout(() => setIsPlaying(false), duration); 
  }, [card, speak]);

  // Nav Dot Pagination (Max 7 Visible)
  const MAX_VISIBLE_DOTS = 7;
  const halfDots = Math.floor(MAX_VISIBLE_DOTS / 2);
  let dotStart = Math.max(0, currentIndex - halfDots);
  let dotEnd = Math.min(SOCIAL_CARDS.length, dotStart + MAX_VISIBLE_DOTS);
  if (dotEnd - dotStart < MAX_VISIBLE_DOTS) {
    dotStart = Math.max(0, dotEnd - MAX_VISIBLE_DOTS);
  }
  const visibleDots = SOCIAL_CARDS.slice(dotStart, dotEnd);

  return (
    <View style={styles.container}>
      {/* ── Background Wave ── */}
      <View style={styles.waveContainer}>
        <Svg height={Math.min(520, height * 0.55)} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
             <LinearGradient id="ssGrad" x1="0%" y1="0%" x2="100%" y2="100%">
               <Stop offset="0%" stopColor="#4B3FD8" />
               <Stop offset="40%" stopColor={card.color + 'E6'} />
               <Stop offset="100%" stopColor={card.color} />
             </LinearGradient>
          </Defs>
          <Path fill="url(#ssGrad)" d="M0,250L48,230C96,210,192,170,288,160C384,150,480,170,576,190C672,210,768,230,864,220C960,210,1056,170,1152,150C1248,130,1344,130,1392,130L1440,130L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <FloatingOrb size={70} color={card.color + '18'} top={60} left={width - 90} delay={0} />
      <FloatingOrb size={45} color={card.color + '20'} top={120} left={20} delay={300} />

      <SafeAreaView style={styles.safeArea}>
        
        {/* ── Header ── */}
        <Animated.View style={styles.headerTop}>
          <TouchableOpacity 
             style={styles.backButton} 
             onPress={onBack} 
             activeOpacity={0.8}
             accessibilityRole="button"
             accessibilityLabel="Go back"
             accessibilityHint="Navigates to the previous screen"
          >
            <BackArrowIcon size={22} color={card.color} />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
             <Text 
                style={styles.title} 
                accessibilityRole="header" 
                allowFontScaling={true} 
                maxFontSizeMultiplier={1.5}
             >
               Social Skills
             </Text>
             <Text 
                style={styles.subtitleText} 
                allowFontScaling={true} 
                maxFontSizeMultiplier={1.5}
                accessibilityLabel={`Card ${currentIndex + 1} of ${SOCIAL_CARDS.length}`}
             >
               {`${currentIndex + 1} OF ${SOCIAL_CARDS.length}`}
             </Text>
          </View>
        </Animated.View>

        {/* ── Animated Progress Bar ── */}
        <View style={styles.progressOuter} accessibilityRole="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={((currentIndex + 1) / SOCIAL_CARDS.length) * 100}>
          <Animated.View style={[
             styles.progressInner, 
             { backgroundColor: card.color, width: progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }
          ]} />
        </View>

        {/* ── Main Flashcard Center Area ── */}
        <View style={styles.cardArea}>
           <Animated.View 
             style={[
                styles.bigCard, 
                { transform: [{ translateX: slideAnim }] },
                { shadowColor: card.color } // Native shadow tinting pulling from current index focus
             ]}
             accessibilityRole="summary"
           >
              <View style={[styles.emojiCircle, { backgroundColor: card.color + '18' }]}>
                 <Text style={styles.bigEmoji} allowFontScaling={false}>{card.emoji}</Text>
              </View>
              
              <Text style={styles.cardTitle} allowFontScaling={true} maxFontSizeMultiplier={1.5}>{card.title}</Text>
              
              <View style={[styles.tipPill, { backgroundColor: card.color + '15' }]}>
                 <Text style={[styles.tipText, { color: card.color }]} allowFontScaling={true} maxFontSizeMultiplier={1.5}>{card.tip}</Text>
              </View>

              <TouchableOpacity 
                style={[styles.voiceButton, { backgroundColor: card.color }]} 
                onPress={handleSpeak}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`Listen to information about ${card.title}`}
                accessibilityHint="Reads the text explaining this social skill aloud."
              >
                 <AnimatedSpeakerIcon isPlaying={isPlaying} color={COLORS.textOnDark} />
                 <Text style={styles.voiceButtonText} allowFontScaling={true} maxFontSizeMultiplier={1.3}>
                   Hear It
                 </Text>
              </TouchableOpacity>
           </Animated.View>
        </View>

        {/* ── Smooth Uniform Pill Navigation Bottom Array ── */}
        <View style={styles.navRow}>
           <TouchableOpacity 
             style={[styles.navBtn, { borderColor: card.color }]} 
             onPress={() => slideCard('prev')}
             activeOpacity={0.8}
             accessibilityRole="button"
             accessibilityLabel="Previous card"
             accessibilityHint="Navigates to the previous social skill card."
           >
              <Text style={[styles.navBtnText, { color: card.color }]} allowFontScaling={true} maxFontSizeMultiplier={1.5}>Back</Text>
           </TouchableOpacity>

           {/* Animated Nav Dots */}
           <View style={styles.dotsRow} accessible={false}>
              {dotStart > 0 ? <Text style={styles.dotEllipsis} allowFontScaling={false}>…</Text> : null}
              {visibleDots.map((_, i) => {
                 const actualIndex = dotStart + i;
                 const isActive = actualIndex === currentIndex;
                 return (
                    <View key={actualIndex} style={[
                       styles.dot,
                       isActive && { backgroundColor: card.color, width: 22, height: 10 } // active dot slightly larger
                    ]} />
                 );
              })}
              {dotEnd < SOCIAL_CARDS.length ? <Text style={styles.dotEllipsis} allowFontScaling={false}>…</Text> : null}
           </View>

           <TouchableOpacity 
             style={[styles.navBtn, { backgroundColor: card.color, borderColor: card.color }]} 
             onPress={() => slideCard('next')}
             activeOpacity={0.8}
             accessibilityRole="button"
             accessibilityLabel="Next card"
             accessibilityHint="Navigates to the next social skill card."
           >
              <Text style={[styles.navBtnText, { color: COLORS.textOnDark }]} allowFontScaling={true} maxFontSizeMultiplier={1.5}>Next</Text>
           </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Should map to off-white like '#F8F7FF' internally
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
    marginTop: SPACING.lg,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    color: '#FFFFFF', // Changed text inside wave area to be high contrast white
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: TYPOGRAPHY.sizes.caption,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: TYPOGRAPHY.weights.bold as any,
    marginTop: 4,
    letterSpacing: 1.2,
  },
  progressOuter: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    borderRadius: RADII.full,
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    borderRadius: RADII.full,
  },

  // Main Card Area
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md, // offset
  },
  bigCard: {
    backgroundColor: '#FFFFFF', // Ensure pure white surface for high contrast
    borderRadius: RADII.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    width: '100%',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  emojiCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  bigEmoji: {
    fontSize: 85,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.sizes.h1,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  tipPill: {
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  tipText: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.bold as any,
    textAlign: 'center',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.xl,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    width: '100%',
    ...SHADOWS.elevated,
  },
  voiceButtonText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.sizes.h2,
    fontWeight: TYPOGRAPHY.weights.black as any,
    letterSpacing: 0.5,
  },

  // Navigation Row Pill Bounds
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
    backgroundColor: '#CBD5E1', // light slate mapping standard bounds
    marginHorizontal: 4,
  },
  dotEllipsis: {
    marginHorizontal: 4,
    fontSize: TYPOGRAPHY.sizes.label,
    color: '#CBD5E1',
    fontWeight: TYPOGRAPHY.weights.bold as any,
  },
});

export default SocialSkillsCardScreen;
