import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { BackArrowIcon, PlayIcon } from '../components/icons/ConditionIcons';
import { learningContent, ANIMAL_SOUNDS } from '../data/visualLearningDataLocal';
import { COLORS, SPACING, RADII, TYPOGRAPHY, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');

const EMOJI_FALLBACKS: Record<string, string> = {
  cat: '🐱', dog: '🐕', cow: '🐄', lion: '🦁', elephant: '🐘', horse: '🐴', sheep: '🐑', pig: '🐷',
  bird: '🐦', duck: '🦆', parrot: '🦜', rooster: '🐓', owl: '🦉', crow: '🐦‍⬛',
  apple: '🍎', car: '🚗', book: '📚', chair: '🪑', phone: '📱', watch: '⌚', shoes: '👟', ball: '⚽',
  morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙', noon: '🌞', sunrise: '🌄', sunset: '🌇',
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ── ANSWER PILL COMPONENT ──
const AnswerPill = ({ label, isSelected, isCorrect, isWrong, onPress }: any) => {
  const scale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isWrong) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    }
  }, [isWrong]);

  let backgroundColor: string = COLORS.surface;
  let fontColor: string = COLORS.textPrimary;
  let borderColor: string = 'rgba(0,0,0,0.1)';

  if (isCorrect) {
    backgroundColor = '#10B981'; // Green
    fontColor = '#FFF';
    borderColor = '#10B981';
  } else if (isWrong) {
    backgroundColor = '#FEE2E2'; // Light Red
    fontColor = '#EF4444'; // Red Text
    borderColor = '#EF4444';
  } else if (isSelected) {
    backgroundColor = COLORS.primaryDark;
    fontColor = '#FFF';
    borderColor = COLORS.primaryDark;
  }

  return (
    <AnimatedTouchable
      style={[
        styles.wordOption,
        { 
           backgroundColor, 
           borderColor,
           transform: [{ scale }, { translateX: shakeAnim }] 
        }
      ]}
      onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
    >
      <Text 
         style={[styles.wordOptionText, { color: fontColor }]}
         allowFontScaling={true}
         maxFontSizeMultiplier={1.2}
      >
         {`${label}${isCorrect ? ' ✓' : ''}`}
      </Text>
    </AnimatedTouchable>
  );
};

interface VisualLearningQuizScreenProps {
  selectedCategory: string;
  onBack: () => void;
  onComplete: () => void;
}

export const VisualLearningQuizScreen: React.FC<VisualLearningQuizScreenProps> = ({ selectedCategory, onBack, onComplete }) => {
  const { t } = useLanguage();
  const { speak } = useTTS();
  
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | string[] | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [wrongWord, setWrongWord] = useState<string | null>(null);
  
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const imageLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentContent = learningContent[selectedCategory as keyof typeof learningContent]?.[currentLevel];
  const maxLevels = learningContent[selectedCategory as keyof typeof learningContent]?.length || 0;

  useEffect(() => {
    return () => {
      if (imageLoadTimeoutRef.current) clearTimeout(imageLoadTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentContent) {
      setShuffledOptions(shuffleArray(currentContent.options));
      if (imageLoadTimeoutRef.current) clearTimeout(imageLoadTimeoutRef.current);
      setImageLoading(true);
      setImageError(false);
      imageLoadTimeoutRef.current = setTimeout(() => setImageLoading(false), 2000);
      
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]).start();
    }
  }, [currentLevel, currentContent]);

  const nextLevel = useCallback(() => {
    if (currentLevel < maxLevels - 1) {
      setCurrentLevel(prev => prev + 1);
      setSelectedWord(null);
      setShowFeedback(false);
      setWrongWord(null);
    } else {
      speak('Congratulations! You completed all levels!');
      setTimeout(() => onComplete(), 1500);
    }
  }, [currentLevel, maxLevels, onComplete, speak]);

  const handleWordSelect = (word: string) => {
    if (!currentContent) return;
    
    if (selectedCategory === 'sentences') {
        const sentenceArr = Array.isArray(selectedWord) ? selectedWord : [];
        if (sentenceArr.length >= ((currentContent as any).maxWords || 4)) return;
        
        const newSentence = [...sentenceArr, word];
        setSelectedWord(newSentence);
        speak(word);
        
        if (newSentence.length === currentContent.correctAnswer.length) {
            if (JSON.stringify(newSentence) === JSON.stringify(currentContent.correctAnswer)) {
                setShowFeedback(true);
                speak('Correct! ' + newSentence.join(' '));
                setTimeout(() => nextLevel(), 1000); 
            } else {
                setWrongWord(word);
                setTimeout(() => setWrongWord(null), 800);
            }
        }
    } else {
        setSelectedWord(word);
        speak(word);
        
        if (word === currentContent.correctAnswer) {
            setShowFeedback(true);
            speak('Correct!');
            setTimeout(() => nextLevel(), 1000); // Wait 1 second before going to next
        } else {
            setWrongWord(word);
            setTimeout(() => {
                setWrongWord(null);
                setSelectedWord(null);
            }, 800);
        }
    }
  };

  const speakAnswer = () => {
    if (!currentContent) return;
    const answer = Array.isArray(currentContent.correctAnswer) 
       ? currentContent.correctAnswer.join(' ') 
       : currentContent.correctAnswer;
    speak(answer);
  };

  const playAnimalSound = () => {
    if (!currentContent) return;
    const sound = ANIMAL_SOUNDS[currentContent.correctAnswer as keyof typeof ANIMAL_SOUNDS];
    if (sound) speak(sound);
  };

  const removeLastWord = () => {
    if (Array.isArray(selectedWord) && selectedWord.length > 0) {
      const newSentence = selectedWord.slice(0, -1);
      setSelectedWord(newSentence.length > 0 ? newSentence : null);
    }
  };

  if (!currentContent) return null;

  const imageSource = useMemo(() => {
    const c = currentContent as any;
    if (c.image) {
      const resolved = Image.resolveAssetSource(c.image);
      if (resolved?.uri) return { uri: resolved.uri };
      return c.image;
    }
    if (c.imageUri) return { uri: c.imageUri };
    return undefined;
  }, [currentContent]);

  const isSentenceMode = selectedCategory === 'sentences';
  const hasAnimalSound = currentContent.hasSound && (selectedCategory === 'animals' || selectedCategory === 'birds');

  // Split options explicitly into rows of 2 to guarantee a 2x2 grid without wrap fragmentation
  const row1 = shuffledOptions.slice(0, 2);
  const row2 = shuffledOptions.slice(2, 4);

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        <Svg height={250} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="quizGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              {/* Changed header gradient to solid deep purple theme */}
              <Stop offset="0%" stopColor="#4B3FD8" />
              <Stop offset="100%" stopColor="#4135B3" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#quizGrad)" d="M0,250L48,230C96,210,192,170,288,160C384,150,480,170,576,190C672,210,768,230,864,220C960,210,1056,170,1152,150C1248,130,1344,130,1392,130L1440,130L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8} accessibilityRole="button">
            <BackArrowIcon size={22} color="#4B3FD8" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title} allowFontScaling={true}>{t(`visualLearningCategories.${selectedCategory}`) || selectedCategory}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Level Tracker Pill */}
          <View style={styles.levelIndicator}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText} allowFontScaling={true}>{`Level ${currentLevel + 1} of ${maxLevels}`}</Text>
            </View>
          </View>

          {/* Core Image Card */}
          <Animated.View style={[
             styles.imageContainer, 
             { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
             showFeedback ? { borderColor: '#10B981', borderWidth: 4 } : {}
          ]}>
            {!imageError && imageSource ? (
              <>
                {imageLoading ? (
                  <View style={styles.imageLoadingContainer}>
                    <ActivityIndicator size="large" color="#4B3FD8" />
                  </View>
                ) : null}
                <Image
                  key={`${selectedCategory}-${currentContent.id}`}
                  source={imageSource}
                  style={styles.image}
                  onLoadStart={() => setImageLoading(true)}
                  onLoad={() => setImageLoading(false)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => { setImageLoading(false); setImageError(true); }}
                />
              </>
            ) : (
              <View style={styles.emojiContainer}>
                <Text style={styles.emojiText} allowFontScaling={false}>
                  {Array.isArray(currentContent.correctAnswer) ? '📷' : EMOJI_FALLBACKS[currentContent.correctAnswer as string] || '📷'}
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Symmetrical Equal Sized Helper Actions */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.speakButtonOutlined} onPress={speakAnswer} activeOpacity={0.8}>
              <PlayIcon size={20} color="#4B3FD8" />
              <Text style={styles.btnTextOutline} allowFontScaling={true} maxFontSizeMultiplier={1.2}>
                {t('hearAnswer') || 'Hear Answer'}
              </Text>
            </TouchableOpacity>
            
            {hasAnimalSound ? (
              <TouchableOpacity style={styles.animalSoundButtonFilled} onPress={playAnimalSound} activeOpacity={0.8}>
                <Text style={styles.btnTextWhite} allowFontScaling={true} maxFontSizeMultiplier={1.2}>
                  {`🔊 ${t('animalSound') || 'Animal Sound'}`}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {isSentenceMode ? (
             <View style={styles.sentenceWrapper}>
                <View style={styles.sentenceBox}>
                   {!selectedWord || selectedWord.length === 0 ? (
                      <Text style={styles.sentencePlaceholder}>Tap words to build a sentence</Text>
                   ) : (
                      <View style={styles.sentenceWordsRow}>
                         {(selectedWord as string[]).map((w, idx) => (
                            <View key={idx} style={styles.wordChip}>
                               <Text style={styles.wordChipText}>{w}</Text>
                            </View>
                         ))}
                      </View>
                   )}
                </View>
                {Array.isArray(selectedWord) && selectedWord.length > 0 ? (
                   <TouchableOpacity style={styles.removeButton} onPress={removeLastWord}>
                      <Text style={styles.removeText}>Remove Last</Text>
                   </TouchableOpacity>
                ) : null}
             </View>
          ) : null}

          {/* Firm 2x2 Grid using explicit Row Wrappers */}
          <View style={styles.optionsGrid}>
            <View style={styles.optionsRow}>
              {row1.map((word, index) => {
                 const isCorrect = showFeedback && 
                    (isSentenceMode 
                       ? (Array.isArray(selectedWord) && selectedWord.includes(word)) 
                       : word === currentContent.correctAnswer);
                 const isWrong = wrongWord === word;
                 const isSelectedSentence = isSentenceMode && Array.isArray(selectedWord) && selectedWord.includes(word);

                 return (
                    <View key={index} style={styles.gridItem}>
                       <AnswerPill
                          label={t(`words.${word}`) || word}
                          isCorrect={isCorrect}
                          isWrong={isWrong}
                          isSelected={isSelectedSentence}
                          onPress={() => handleWordSelect(word)}
                       />
                    </View>
                 );
              })}
            </View>
            {row2.length > 0 && (
               <View style={styles.optionsRow}>
                 {row2.map((word, index) => {
                    const isCorrect = showFeedback && 
                       (isSentenceMode 
                          ? (Array.isArray(selectedWord) && selectedWord.includes(word)) 
                          : word === currentContent.correctAnswer);
                    const isWrong = wrongWord === word;
                    const isSelectedSentence = isSentenceMode && Array.isArray(selectedWord) && selectedWord.includes(word);

                    return (
                       <View key={index} style={styles.gridItem}>
                          <AnswerPill
                             label={t(`words.${word}`) || word}
                             isCorrect={isCorrect}
                             isWrong={isWrong}
                             isSelected={isSelectedSentence}
                             onPress={() => handleWordSelect(word)}
                          />
                       </View>
                    );
                 })}
               </View>
            )}
          </View>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.md,
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
    fontSize: TYPOGRAPHY.sizes.h1 - 2,
    fontWeight: TYPOGRAPHY.weights.black as any,
    color: '#FFF',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  
  levelIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADII.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,1)',
    ...SHADOWS.elevated,
  },
  levelText: {
    color: '#4B3FD8',
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.black as any,
    letterSpacing: 0.5,
  },

  imageContainer: {
    width: '100%',
    height: 320,
    backgroundColor: COLORS.surface,
    borderRadius: 16, // Explicit 16px requirement by user
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    zIndex: 1,
  },
  emojiContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  emojiText: {
    fontSize: 140,
    textAlign: 'center',
  },

  actionButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  speakButtonOutlined: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    borderRadius: RADII.lg,
    borderWidth: 2,
    borderColor: '#4B3FD8',
    ...SHADOWS.card,
  },
  animalSoundButtonFilled: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: SPACING.lg,
    borderRadius: RADII.lg,
    ...SHADOWS.card, // Matched shadow weighting to make side-by-side balanced
  },
  btnTextOutline: {
    color: '#4B3FD8',
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.black as any,
    marginLeft: SPACING.sm,
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.black as any,
    marginLeft: SPACING.sm,
  },

  optionsGrid: {
    width: '100%',
    flexDirection: 'column',
    gap: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridItem: {
    width: '48%',
  },
  wordOption: {
    minHeight: 64, // Standard 64px for best tap targets natively over min 60 requirement
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    borderRadius: RADII.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    ...SHADOWS.card,
  },
  wordOptionText: {
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.black as any,
    textAlign: 'center',
  },

  sentenceWrapper: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  sentenceBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    minHeight: 100,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
    marginBottom: SPACING.md,
  },
  sentencePlaceholder: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.bold as any,
    textAlign: 'center',
  },
  sentenceWordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    justifyContent: 'center',
  },
  wordChip: {
    backgroundColor: '#4B3FD8',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADII.md,
  },
  wordChipText: {
    color: '#FFF',
    fontSize: TYPOGRAPHY.sizes.h3,
    fontWeight: TYPOGRAPHY.weights.bold as any,
  },
  removeButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderRadius: RADII.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  removeText: {
    color: '#EF4444',
    fontSize: TYPOGRAPHY.sizes.body,
    fontWeight: TYPOGRAPHY.weights.black as any,
  },
});

export default VisualLearningQuizScreen;
