import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated as RNAnimated,
  Easing
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useTTS } from '../contexts/TTSContext';
import { BackArrowIcon } from '../components/icons/ConditionIcons';
import { SPACING, RADII, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

const AnimatedPath = RNAnimated.createAnimatedComponent(Path);

// Subtle sound-wave animation while TTS is playing
const SoundWaveIcon = ({ isPlaying, color }: { isPlaying: boolean; color: string }) => {
  const wave1 = useRef(new RNAnimated.Value(0)).current;
  const wave2 = useRef(new RNAnimated.Value(0)).current;
  const wave3 = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      RNAnimated.loop(
        RNAnimated.stagger(150, [
          RNAnimated.sequence([
            RNAnimated.timing(wave1, { toValue: 1, duration: 300, useNativeDriver: true }),
            RNAnimated.timing(wave1, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]),
          RNAnimated.sequence([
            RNAnimated.timing(wave2, { toValue: 1, duration: 300, useNativeDriver: true }),
            RNAnimated.timing(wave2, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]),
          RNAnimated.sequence([
            RNAnimated.timing(wave3, { toValue: 1, duration: 300, useNativeDriver: true }),
            RNAnimated.timing(wave3, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]),
        ])
      ).start();
    } else {
      wave1.stopAnimation(); wave2.stopAnimation(); wave3.stopAnimation();
      wave1.setValue(0); wave2.setValue(0); wave3.setValue(0);
    }
  }, [isPlaying, wave1, wave2, wave3]);

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
      <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill={color} />
      <AnimatedPath d="M15.54 8.46C16.47 9.4 17 10.67 17 12C17 13.33 16.47 14.6 15.54 15.53" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity={wave1 as any} />
      <AnimatedPath d="M19.07 4.93C20.94 6.8 22 9.35 22 12C22 14.65 20.94 17.2 19.07 19.07" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity={wave2 as any} />
    </Svg>
  );
};

export interface FlashcardScreenProps<T> {
  title: string;
  items: T[];
  accentColor: string;
  renderCard: (item: T) => React.ReactNode;
  getSpeakString: (item: T) => string;
  onBack: () => void;
  onFinish?: () => void;
}

export function FlashcardScreen<T>({
  title,
  items,
  accentColor,
  renderCard,
  getSpeakString,
  onBack,
  onFinish,
}: FlashcardScreenProps<T>) {
  const { speak } = useTTS();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Smooth Progress Bar logic
  const progressAnim = useRef(new RNAnimated.Value(0)).current;
  
  useEffect(() => {
    RNAnimated.timing(progressAnim, {
      toValue: ((currentIndex + 1) / items.length) * 100,
      duration: 500,
      useNativeDriver: false, // tracking width interpolations
    }).start();
  }, [currentIndex, items.length, progressAnim]);

  // Standard RNAnimated Horizontal Transition Logic
  const translateX = useRef(new RNAnimated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex >= items.length - 1) {
      onFinish ? onFinish() : onBack();
      return;
    }
    
    // Slide out to left
    RNAnimated.timing(translateX, {
      toValue: -width,
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setCurrentIndex(prev => prev + 1);
        translateX.setValue(width); // snap to right
        
        // slide in from right
        RNAnimated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const handlePlaySound = () => {
    const text = getSpeakString(items[currentIndex]);
    setIsPlaying(true);
    speak(text);
    // Simulate TTS duration logic visually
    setTimeout(() => setIsPlaying(false), Math.max(2000, text.length * 80));
  };

  const isLast = currentIndex === items.length - 1;
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      {/* Wave Header Base */}
      <View style={styles.waveContainer}>
        <Svg height={280} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="flashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#1E1B4B" />
              <Stop offset="100%" stopColor={accentColor} />
            </LinearGradient>
          </Defs>
          <Path fill="url(#flashGrad)" d="M0,250L48,230C96,210,192,170,288,160C384,150,480,170,576,190C672,210,768,230,864,220C960,210,1056,170,1152,150C1248,130,1344,130,1392,130L1440,130L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header Content */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: accentColor + '66' }]} onPress={onBack}>
            <BackArrowIcon size={22} color={accentColor} />
          </TouchableOpacity>
          <View style={styles.titles}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{`${currentIndex + 1} OF ${items.length}`}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        {/* Smooth Progress Bar */}
        <View style={styles.progressOuter}>
          <RNAnimated.View style={[styles.progressInner, { width: progressWidth, backgroundColor: accentColor }]} />
        </View>

        <View style={styles.cardArea}>
          <RNAnimated.View style={[styles.card, { transform: [{ translateX }] }]}>
             {renderCard(items[currentIndex])}
          </RNAnimated.View>
        </View>

        {/* Equal Height Action Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.playBtn, { borderColor: accentColor }]}
            onPress={handlePlaySound}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <SoundWaveIcon isPlaying={isPlaying} color={accentColor} />
            <Text style={[styles.playBtnText, { color: accentColor }]} allowFontScaling={false}>Play Sound</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.btn, styles.nextBtn, { backgroundColor: accentColor }]}
            onPress={handleNext}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text style={styles.nextBtnText} allowFontScaling={false}>{isLast ? '✓ Finish' : 'Next →'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },
  waveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 16,
    zIndex: 10,
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  titles: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    marginTop: 3,
    letterSpacing: 1.5,
  },
  progressOuter: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    borderRadius: 4,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 52, // Explicit 52px height boundary required by user
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  playBtn: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    ...SHADOWS.md,
  },
  playBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  nextBtn: {
    ...SHADOWS.lg,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
  },
});

export default FlashcardScreen;
