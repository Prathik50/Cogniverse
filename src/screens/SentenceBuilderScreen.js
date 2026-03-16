import React, { useState, useEffect, useRef, useMemo } from 'react';
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
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { BackArrowIcon, PlayIcon } from '../components/icons/ConditionIcons';
import { learningContent, ANIMAL_SOUNDS, categories } from '../data/visualLearningDataLocal';

// Emoji fallbacks if images don't load
const EMOJI_FALLBACKS = {
  cat: '🐱', dog: '🐕', cow: '🐄', lion: '🦁', elephant: '🐘', horse: '🐴', sheep: '🐑', pig: '🐷',
  bird: '🐦', duck: '🦆', parrot: '🦜', rooster: '🐓', owl: '🦉', crow: '🐦‍⬛',
  apple: '🍎', car: '🚗', book: '📚', chair: '🪑', phone: '📱', watch: '⌚', shoes: '👟', ball: '⚽',
  morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙', noon: '🌞', sunrise: '🌄', sunset: '🌇',
};

const VisualLearningScreen = ({ onBack }) => {
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
  const imageLoadTimeoutRef = useRef(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Shuffle array function
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
      if (imageLoadTimeoutRef.current) {
        clearTimeout(imageLoadTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Shuffle options when level changes
      const currentContent = learningContent[selectedCategory][currentLevel];
      setShuffledOptions(shuffleArray(currentContent.options));
      if (imageLoadTimeoutRef.current) {
        clearTimeout(imageLoadTimeoutRef.current);
      }
      setImageLoading(true);
      setImageError(false);
      imageLoadTimeoutRef.current = setTimeout(() => {
        setImageLoading(false);
      }, 2000);
      
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      ]).start();
    }
  }, [selectedCategory, currentLevel]);

  const handleCategorySelect = (categoryId) => {
    if (imageLoadTimeoutRef.current) {
      clearTimeout(imageLoadTimeoutRef.current);
    }
    setSelectedCategory(categoryId);
    setCurrentLevel(0);
    setSelectedWord(null);
    setShowFeedback(false);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
  };

  const handleWordSelect = (word) => {
    const currentContent = learningContent[selectedCategory][currentLevel];
    
    if (selectedCategory === 'sentences') {
      if (selectedWord && selectedWord.length >= currentContent.maxWords) return;
      const newSentence = selectedWord ? [...selectedWord, word] : [word];
      setSelectedWord(newSentence);
      speak(word);
      if (newSentence.length === currentContent.correctAnswer.length) {
        checkSentenceAnswer(newSentence);
      }
    } else {
      setSelectedWord(word);
      speak(word);
      setTimeout(() => checkAnswer(word), 500);
    }
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

  const checkSentenceAnswer = (sentence) => {
    const currentContent = learningContent[selectedCategory][currentLevel];
    if (JSON.stringify(sentence) === JSON.stringify(currentContent.correctAnswer)) {
      setShowFeedback(true);
      speak('Correct! ' + sentence.join(' '));
      Animated.sequence([
        Animated.timing(successAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(successAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      setTimeout(() => nextLevel(), 2000);
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
        if (imageLoadTimeoutRef.current) {
          clearTimeout(imageLoadTimeoutRef.current);
        }
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

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: currentTheme.colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
    },
    backButton: {
      backgroundColor: currentTheme.colors.primary,
      borderRadius: 25 * currentSpacing.scale,
      width: 50 * currentSpacing.scale,
      height: 50 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16 * currentSpacing.scale,
    },
    headerTitle: {
      fontSize: 24 * currentTextSize.scale,
      fontWeight: '700',
      color: currentTheme.colors.text,
      flex: 1,
    },
    categoryGrid: { padding: 20 * currentSpacing.scale, gap: 16 * currentSpacing.scale },
    categoryCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 20 * currentSpacing.scale,
      padding: 24 * currentSpacing.scale,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    categoryIcon: { fontSize: 60 * currentTextSize.scale, marginBottom: 12 * currentSpacing.scale },
    categoryName: {
      fontSize: 20 * currentTextSize.scale,
      fontWeight: '700',
      color: currentTheme.colors.text,
    },
    content: { flex: 1, padding: 20 * currentSpacing.scale },
    levelBadge: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 16 * currentSpacing.scale,
      paddingVertical: 8 * currentSpacing.scale,
      borderRadius: 20 * currentSpacing.scale,
      alignSelf: 'center',
      marginBottom: 20 * currentSpacing.scale,
    },
    levelText: { color: '#FFFFFF', fontSize: 16 * currentTextSize.scale, fontWeight: '600' },
    imageContainer: {
      width: '100%',
      height: 320 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 24 * currentSpacing.scale,
      overflow: 'hidden',
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 4,
      borderColor: showFeedback ? '#10B981' : currentTheme.colors.primary,
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    emojiContainer: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.colors.surface,
    },
    emojiText: {
      fontSize: 180 * currentTextSize.scale,
      textAlign: 'center',
    },
    imageLoadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.colors.surface,
      zIndex: 1,
    },
    actionButtonsRow: {
      flexDirection: 'row',
      gap: 12 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
    },
    speakButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentTheme.colors.primary,
      paddingVertical: 14 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
    },
    animalSoundButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#10B981',
      paddingVertical: 14 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16 * currentTextSize.scale,
      fontWeight: '600',
      marginLeft: 8 * currentSpacing.scale,
    },
    sentenceArea: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 20 * currentSpacing.scale,
      padding: 20 * currentSpacing.scale,
      minHeight: 80 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 2,
      borderColor: showFeedback ? '#10B981' : currentTheme.colors.border,
    },
    sentenceWords: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 * currentSpacing.scale },
    wordChip: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 20 * currentSpacing.scale,
      paddingVertical: 12 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
    },
    wordChipText: { color: '#FFFFFF', fontSize: 18 * currentTextSize.scale, fontWeight: '600' },
    removeButton: {
      backgroundColor: '#EF4444',
      paddingVertical: 14 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
      alignItems: 'center',
      marginBottom: 20 * currentSpacing.scale,
    },
    wordOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 * currentSpacing.scale },
    wordOption: {
      backgroundColor: currentTheme.colors.surface,
      paddingHorizontal: 24 * currentSpacing.scale,
      paddingVertical: 16 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
      borderWidth: 2,
      borderColor: currentTheme.colors.border,
    },
    wordOptionText: {
      color: currentTheme.colors.text,
      fontSize: 18 * currentTextSize.scale,
      fontWeight: '600',
    },
    successOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(16, 185, 129, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 24 * currentSpacing.scale,
    },
    successText: { fontSize: 48 * currentTextSize.scale, fontWeight: '700', color: '#FFFFFF' },
  });
  const currentContent = selectedCategory ? learningContent[selectedCategory][currentLevel] : null;

  const imageSource = useMemo(() => {
    if (!currentContent) return undefined;
    if (currentContent.image) {
      const resolved = Image.resolveAssetSource(currentContent.image);
      if (resolved?.uri) {
        return { uri: resolved.uri };
      }
      return currentContent.image;
    }
    if (currentContent.imageUri) {
      return { uri: currentContent.imageUri };
    }
    return undefined;
  }, [currentContent]);

  const isSentenceMode = selectedCategory === 'sentences';
  const hasAnimalSound = currentContent?.hasSound && (selectedCategory === 'animals' || selectedCategory === 'birds');

  if (!selectedCategory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <BackArrowIcon size={24 * currentTextSize.scale} color={currentTheme.colors.surface} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{t('visualLearningTitle')}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.bgColor }]}
              onPress={() => handleCategorySelect(category.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{t(`visualLearningCategories.${category.id}`)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!currentContent) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (imageLoadTimeoutRef.current) {
              clearTimeout(imageLoadTimeoutRef.current);
            }
            setSelectedCategory(null);
            setCurrentLevel(0);
            setSelectedWord(null);
          }}
          activeOpacity={0.7}
        >
          <BackArrowIcon size={24 * currentTextSize.scale} color={currentTheme.colors.surface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t(`visualLearningCategories.${selectedCategory}`)}</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {currentLevel + 1}/{learningContent[selectedCategory].length}</Text>
        </View>
        <Animated.View style={[styles.imageContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}> 
          {!imageError && imageSource ? (
            <>
              {imageLoading && (
                <View style={styles.imageLoadingContainer}>
                  <ActivityIndicator size="large" color={currentTheme.colors.primary} />
                </View>
              )}
              <Image
                key={`${selectedCategory}-${currentContent.id}`}
                source={imageSource}
                style={styles.image}
                onLoadStart={() => setImageLoading(true)}
                onLoad={() => {
                  if (imageLoadTimeoutRef.current) {
                    clearTimeout(imageLoadTimeoutRef.current);
                  }
                  setImageLoading(false);
                }}
                onLoadEnd={() => {
                  if (imageLoadTimeoutRef.current) {
                    clearTimeout(imageLoadTimeoutRef.current);
                  }
                  setImageLoading(false);
                }}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                  console.log('Image load error - showing emoji fallback');
                }}
                resizeMode="cover"
              />
            </>
          ) : (
            <View style={styles.emojiContainer}>
              <Text style={styles.emojiText}>
                {Array.isArray(currentContent.correctAnswer)
                  ? '📷'
                  : EMOJI_FALLBACKS[currentContent.correctAnswer] || '📷'}
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
          <TouchableOpacity style={styles.speakButton} onPress={speakAnswer} activeOpacity={0.8}>
            <PlayIcon size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>{t('hearAnswer')}</Text>
          </TouchableOpacity>
          {hasAnimalSound && (
            <TouchableOpacity style={styles.animalSoundButton} onPress={playAnimalSound} activeOpacity={0.8}>
              <Text style={[styles.buttonText, { marginLeft: 0 }]}>🔊 {t('animalSound')}</Text>
            </TouchableOpacity>
          )}
        </View>
        {isSentenceMode && (
          <>
            <View style={styles.sentenceArea}>
              <View style={styles.sentenceWords}>
                {!selectedWord || selectedWord.length === 0 ? (
                  <Text style={{ color: currentTheme.colors.textSecondary }}>{t('tapActionsBelow')}</Text>
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
              <TouchableOpacity style={styles.removeButton} onPress={removeLastWord} activeOpacity={0.8}>
                <Text style={[styles.buttonText, { marginLeft: 0 }]}>{t('removeLastWord')}</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        <View style={styles.wordOptions}>
          {shuffledOptions.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={styles.wordOption}
              onPress={() => handleWordSelect(word)}
              activeOpacity={0.7}
            >
              <Text style={styles.wordOptionText}>{t(`words.${word}`) || word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VisualLearningScreen;
