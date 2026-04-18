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
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { BackArrowIcon, PlayIcon } from '../components/icons/ConditionIcons';
import { learningContent, ANIMAL_SOUNDS, categories } from '../data/visualLearningDataLocal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;

// Emoji fallbacks
const EMOJI_FALLBACKS = {
  cat: '🐱', dog: '🐕', cow: '🐄', lion: '🦁', elephant: '🐘', horse: '🐴', sheep: '🐑', pig: '🐷',
  bird: '🐦', duck: '🦆', parrot: '🦜', rooster: '🐓', owl: '🦉', crow: '🐦‍⬛',
  apple: '🍎', car: '🚗', book: '📚', chair: '🪑', phone: '📱', watch: '⌚', shoes: '👟', ball: '⚽',
  morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙', noon: '🌞', sunrise: '🌄', sunset: '🌇',
};

// Floating decorative orb
const FloatingOrb = ({ size, color, top, left, delay = 0 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 1000, delay, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 3000 + delay, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000 + delay, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  return (
    <Animated.View
      style={{
        position: 'absolute', top, left, width: size, height: size,
        borderRadius: size / 2, backgroundColor: color,
        opacity: opacityAnim, transform: [{ translateY }],
      }}
    />
  );
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const SentenceBuilderScreen = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;

  // Staggered animations for category list
  const cardAnims = useRef(
    categories.map(() => ({
      fade: new Animated.Value(0),
      slide: new Animated.Value(60),
      scale: new Animated.Value(0.92),
    }))
  ).current;

  const imageLoadTimeoutRef = useRef(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    return () => {
      if (imageLoadTimeoutRef.current) clearTimeout(imageLoadTimeoutRef.current);
    };
  }, []);

  // Main Category Menu Entry Anim
  useEffect(() => {
    if (!selectedCategory) {
      Animated.parallel([
        Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(headerSlide, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
      ]).start();

      cardAnims.forEach((anim, i) => {
        const delay = 150 + i * 100;
        Animated.parallel([
          Animated.timing(anim.fade, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
          Animated.spring(anim.slide, { toValue: 0, tension: 50, friction: 8, delay, useNativeDriver: true }),
          Animated.spring(anim.scale, { toValue: 1, tension: 50, friction: 7, delay, useNativeDriver: true }),
        ]).start();
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      const currentContent = learningContent[selectedCategory][currentLevel];
      setShuffledOptions(shuffleArray(currentContent.options));
      if (imageLoadTimeoutRef.current) clearTimeout(imageLoadTimeoutRef.current);
      setImageLoading(true);
      setImageError(false);
      imageLoadTimeoutRef.current = setTimeout(() => { setImageLoading(false); }, 2000);
      
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]).start();
    }
  }, [selectedCategory, currentLevel]);

  const handleCategorySelect = (categoryId) => {
    if (imageLoadTimeoutRef.current) clearTimeout(imageLoadTimeoutRef.current);
    setSelectedCategory(categoryId);
    setCurrentLevel(0);
    setSelectedWord(null);
    setShowFeedback(false);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
  };

  const checkAnswer = (word) => {
    const currentContent = learningContent[selectedCategory][currentLevel];
    if (word === currentContent.correctAnswer) {
      setShowFeedback(true);
      speak('Correct!');
      Animated.sequence([
        Animated.timing(successAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(successAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      setTimeout(() => nextLevel(), 1500);
    }
  };

  const handleWordSelect = (word) => {
    const currentContent = learningContent[selectedCategory][currentLevel];
    if (selectedCategory === 'sentences') {
      if (selectedWord && selectedWord.length >= currentContent.maxWords) return;
      const newSentence = selectedWord ? [...selectedWord, word] : [word];
      setSelectedWord(newSentence);
      speak(word);
      if (newSentence.length === currentContent.correctAnswer.length) {
        if (JSON.stringify(newSentence) === JSON.stringify(currentContent.correctAnswer)) {
          setShowFeedback(true);
          speak('Correct! ' + newSentence.join(' '));
          Animated.sequence([
            Animated.timing(successAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(successAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]).start();
          setTimeout(() => nextLevel(), 2000);
        }
      }
    } else {
      setSelectedWord(word);
      speak(word);
      setTimeout(() => checkAnswer(word), 500);
    }
  };

  const nextLevel = () => {
    const maxLevels = learningContent[selectedCategory].length;
    if (currentLevel < maxLevels - 1) {
      setCurrentLevel(currentLevel + 1);
      setSelectedWord(null);
      setShowFeedback(false);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    } else {
      speak('Congratulations! You completed all levels!');
      setTimeout(() => {
        if (imageLoadTimeoutRef.current) clearTimeout(imageLoadTimeoutRef.current);
        setSelectedCategory(null);
        setCurrentLevel(0);
      }, 2000);
    }
  };

  const speakAnswer = () => {
    const currentContent = learningContent[selectedCategory][currentLevel];
    if (selectedCategory === 'sentences') {
      speak(currentContent.correctAnswer.join(' '));
    } else {
      speak(currentContent.correctAnswer);
    }
  };

  const playAnimalSound = () => {
    const currentContent = learningContent[selectedCategory][currentLevel];
    const sound = ANIMAL_SOUNDS[currentContent.correctAnswer];
    if (sound) speak(sound);
  };

  const removeLastWord = () => {
    if (selectedWord && Array.isArray(selectedWord) && selectedWord.length > 0) {
      const newSentence = selectedWord.slice(0, -1);
      setSelectedWord(newSentence.length > 0 ? newSentence : null);
    }
  };

  // Card Touch interaction wrapper
  const TouchCard = ({ children, onPress, style }) => {
    const scale = useRef(new Animated.Value(1)).current;
    return (
      <AnimatedTouchable
        style={[style, { transform: [{ scale }] }]}
        activeOpacity={0.9}
        onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        onPress={onPress}
      >
        {children}
      </AnimatedTouchable>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    waveContainer: { position: 'absolute', top: 0, left: 0, right: 0 },
    headerTop: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 24, marginTop: 16, zIndex: 10,
    },
    backButton: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderRadius: 20, width: 44, height: 44,
      justifyContent: 'center', alignItems: 'center',
      shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
    },
    headerTitles: { flex: 1, alignItems: 'center', marginRight: 44 },
    title: {
      fontSize: 24, fontWeight: '900', color: '#FFFFFF',
      letterSpacing: 0.3, textShadowColor: 'rgba(0,0,0,0.25)',
      textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
    },
    subtitle: {
      fontSize: 13, color: 'rgba(255,255,255,0.85)',
      fontWeight: '600', marginTop: 3, letterSpacing: 1,
      textTransform: 'uppercase',
    },
    heroSubtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 6,
      paddingHorizontal: 32,
    },
    scrollContent: { paddingTop: 20, paddingHorizontal: 16, paddingBottom: 40 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 24, rowGap: 16 },
    categoryCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      paddingVertical: 24,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.09,
      shadowRadius: 14,
      elevation: 5,
    },
    emojiBox: {
      width: 80,
      height: 80,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
    },
    categoryIcon: { fontSize: 44 },
    categoryName: { fontSize: 15, fontWeight: '800', textAlign: 'center', color: '#1E293B', lineHeight: 21 },
    topArea: { flex: 1, padding: 20 },
    levelIndicator: {
      flexDirection: 'row', justifyContent: 'center', marginBottom: 20,
    },
    levelBadge: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      paddingHorizontal: 16, paddingVertical: 8,
      borderRadius: 20, shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1,
      shadowRadius: 8, elevation: 4,
    },
    levelText: { color: '#4338CA', fontSize: 16, fontWeight: '800' },
    imageContainer: {
      width: '100%', height: 320, backgroundColor: '#FFFFFF',
      borderRadius: 32, overflow: 'hidden', marginBottom: 20,
      shadowColor: '#0F172A', shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.15, shadowRadius: 24, elevation: 12,
      borderWidth: 4, borderColor: showFeedback ? '#10B981' : '#FFFFFF',
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    emojiContainer: {
      width: '100%', height: '100%', justifyContent: 'center',
      alignItems: 'center', backgroundColor: '#F8FAFC',
    },
    emojiText: { fontSize: 140, textAlign: 'center' },
    imageLoadingContainer: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: 'center', alignItems: 'center',
      backgroundColor: '#F8FAFC', zIndex: 1,
    },
    actionButtonsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    speakButton: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#FFFFFF', paddingVertical: 16, borderRadius: 20,
      shadowColor: '#4338CA', shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
    },
    animalSoundButton: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 20,
      shadowColor: '#10B981', shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
    },
    btnTextPrimary: { color: '#4338CA', fontSize: 16, fontWeight: '800', marginLeft: 8 },
    btnTextWhite: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginLeft: 8 },
    sentenceArea: {
      backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24,
      minHeight: 120, marginBottom: 20,
      shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08, shadowRadius: 16, elevation: 8,
      borderWidth: 2, borderColor: showFeedback ? '#10B981' : '#F1F5F9',
    },
    sentenceWords: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    wordChip: {
      backgroundColor: '#4338CA', paddingHorizontal: 20, paddingVertical: 12,
      borderRadius: 16, shadowColor: '#4338CA', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    wordChipText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
    removeButton: {
      backgroundColor: '#FFFFFF', paddingVertical: 14, borderRadius: 16,
      alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#EF4444',
    },
    removeText: { color: '#EF4444', fontSize: 16, fontWeight: '800' },
    wordOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    wordOption: {
      backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingVertical: 16,
      borderRadius: 20, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: '#E2E8F0',
    },
    wordOptionText: { color: '#1E293B', fontSize: 18, fontWeight: '800' },
    successOverlay: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(16, 185, 129, 0.85)',
      justifyContent: 'center', alignItems: 'center',
    },
    successText: { fontSize: 80, fontWeight: '900', color: '#FFFFFF' },
  });

  const currentContent = selectedCategory ? learningContent[selectedCategory][currentLevel] : null;

  const imageSource = useMemo(() => {
    if (!currentContent) return undefined;
    if (currentContent.image) {
      const resolved = Image.resolveAssetSource(currentContent.image);
      if (resolved?.uri) return { uri: resolved.uri };
      return currentContent.image;
    }
    if (currentContent.imageUri) return { uri: currentContent.imageUri };
    return undefined;
  }, [currentContent]);

  const isSentenceMode = selectedCategory === 'sentences';
  const hasAnimalSound = currentContent?.hasSound && (selectedCategory === 'animals' || selectedCategory === 'birds');

  // Main Category Menu view
  if (!selectedCategory) {
    return (
      <View style={styles.container}>
        <View style={styles.waveContainer}>
          <Svg height={350} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <Defs>
              <LinearGradient id="vlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#818CF8" />
                <Stop offset="50%" stopColor="#4338CA" />
                <Stop offset="100%" stopColor="#312E81" />
              </LinearGradient>
            </Defs>
            <Path 
               fill="url(#vlGrad)" 
               d="M0,160L80,149.3C160,139,320,117,480,122.7C640,128,800,160,960,165.3C1120,171,1280,149,1360,138.7L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" 
            />
          </Svg>
        </View>

        <FloatingOrb size={80} color="rgba(255,255,255,0.15)" top={70} left={width - 100} delay={0} />
        <FloatingOrb size={50} color="rgba(255,255,255,0.1)" top={140} left={30} delay={400} />

        <SafeAreaView style={{ flex: 1 }}>
          <Animated.View style={[styles.headerTop, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
            {onBack && (
              <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
                <BackArrowIcon size={22} color="#4338CA" />
              </TouchableOpacity>
            )}
            <View style={styles.headerTitles}>
              <Text style={styles.title} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Look & Learn</Text>
              <Text style={styles.subtitle} allowFontScaling={true} maxFontSizeMultiplier={1.3}>Explore & Identify</Text>
              <Text style={styles.heroSubtitle}>Choose a category to start learning!</Text>
            </View>
          </Animated.View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.categoryGrid}>
              {categories.map((category, index) => {
                const isLastOdd = index === categories.length - 1 && categories.length % 2 !== 0;
                return (
                 <Animated.View
                  key={category.id}
                  style={{
                    width: isLastOdd ? width - 32 : CARD_WIDTH,
                    opacity: cardAnims[index].fade,
                    transform: [
                      { translateY: cardAnims[index].slide },
                      { scale: cardAnims[index].scale },
                    ],
                  }}
                 >
                  <TouchCard
                    style={[
                       styles.categoryCard, 
                       { borderTopColor: category.color },
                       isLastOdd && { width: width - 32 }
                    ]}
                    onPress={() => handleCategorySelect(category.id)}
                  >
                    <View style={[styles.emojiBox, { backgroundColor: category.color + '18' }]}>
                       <Text style={styles.categoryIcon}>{category.icon}</Text>
                    </View>
                    <Text style={[styles.categoryName, { color: category.color }]}>
                      {t(`visualLearningCategories.${category.id}`) || category.name}
                    </Text>
                  </TouchCard>
                 </Animated.View>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  if (!currentContent) return null;

  return (
    <View style={styles.container}>
      {/* Background wave for level view */}
      <View style={styles.waveContainer}>
        <Svg height={350} width="100%" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <Defs>
            <LinearGradient id="lvlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4338CA" />
              <Stop offset="100%" stopColor="#EC4899" />
            </LinearGradient>
          </Defs>
          <Path fill="url(#lvlGrad)" d="M0,224L48,202.7C96,181,192,139,288,138.7C384,139,480,181,576,192C672,203,768,181,864,154.7C960,128,1056,96,1152,90.7C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </Svg>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (imageLoadTimeoutRef.current) clearTimeout(imageLoadTimeoutRef.current);
              setSelectedCategory(null);
              setCurrentLevel(0);
              setSelectedWord(null);
            }}
            activeOpacity={0.8}
          >
            <BackArrowIcon size={22} color="#4338CA" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>{t(`visualLearningCategories.${selectedCategory}`)}</Text>
          </View>
        </View>

        <ScrollView style={styles.topArea} showsVerticalScrollIndicator={false}>
          <View style={styles.levelIndicator}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Level {currentLevel + 1}/{learningContent[selectedCategory].length}</Text>
            </View>
          </View>

          <Animated.View style={[styles.imageContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}> 
            {!imageError && imageSource ? (
              <>
                {imageLoading && (
                  <View style={styles.imageLoadingContainer}>
                    <ActivityIndicator size="large" color="#4338CA" />
                  </View>
                )}
                <Image
                  key={`${selectedCategory}-${currentContent.id}`}
                  source={imageSource}
                  style={styles.image}
                  onLoadStart={() => setImageLoading(true)}
                  onLoad={() => {
                    if (imageLoadTimeoutRef.current) clearTimeout(imageLoadTimeoutRef.current);
                    setImageLoading(false);
                  }}
                  onLoadEnd={() => {
                    if (imageLoadTimeoutRef.current) clearTimeout(imageLoadTimeoutRef.current);
                    setImageLoading(false);
                  }}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                />
              </>
            ) : (
              <View style={styles.emojiContainer}>
                <Text style={styles.emojiText}>
                  {Array.isArray(currentContent.correctAnswer) ? '📷' : EMOJI_FALLBACKS[currentContent.correctAnswer] || '📷'}
                </Text>
              </View>
            )}
            {showFeedback && (
              <Animated.View style={[styles.successOverlay, { opacity: successAnim }]}>
                <Text style={styles.successText}>✓</Text>
              </Animated.View>
            )}
          </Animated.View>

          <View style={styles.actionButtonsRow}>
            <TouchCard style={styles.speakButton} onPress={speakAnswer}>
              <PlayIcon size={20} color="#4338CA" />
              <Text style={styles.btnTextPrimary}>{t('hearAnswer')}</Text>
            </TouchCard>
            {hasAnimalSound && (
              <TouchCard style={styles.animalSoundButton} onPress={playAnimalSound}>
                <Text style={styles.btnTextWhite}>🔊 {t('animalSound')}</Text>
              </TouchCard>
            )}
          </View>

          {isSentenceMode && (
            <>
              <View style={styles.sentenceArea}>
                <View style={styles.sentenceWords}>
                  {!selectedWord || selectedWord.length === 0 ? (
                    <Text style={{ color: '#94A3B8', fontSize: 16, fontWeight: '500' }}>{t('tapActionsBelow')}</Text>
                  ) : (
                    selectedWord.map((word, index) => (
                      <View key={index} style={styles.wordChip}>
                        <Text style={styles.wordChipText}>{word}</Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
              {selectedWord && selectedWord.length > 0 && (
                <TouchCard style={styles.removeButton} onPress={removeLastWord}>
                  <Text style={styles.removeText}>{t('removeLastWord')}</Text>
                </TouchCard>
              )}
            </>
          )}

          <View style={styles.wordOptions}>
            {shuffledOptions.map((word, index) => (
              <TouchCard
                key={index}
                style={styles.wordOption}
                onPress={() => handleWordSelect(word)}
              >
                <Text style={styles.wordOptionText}>{t(`words.${word}`) || word}</Text>
              </TouchCard>
            ))}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SentenceBuilderScreen;

