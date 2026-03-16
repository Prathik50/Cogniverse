import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import { BackArrowIcon, PlayIcon, HelpIcon } from '../components/icons/ConditionIcons';

const { width } = Dimensions.get('window');

const SentenceBuilderScreen = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userSentence, setUserSentence] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Image URLs for objects (using placeholder images - replace with actual assets)
  const levels = [
    // Level 1-8: Single Words
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
      description: 'Find the word for this animal',
      correctSentence: ['cat'],
      wordOptions: ['cat', 'dog', 'bird', 'fish'],
      levelType: 'word',
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
      description: 'Find the word for this fruit',
      correctSentence: ['apple'],
      wordOptions: ['apple', 'banana', 'orange', 'grape'],
      levelType: 'word',
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
      description: 'Find the word for this vehicle',
      correctSentence: ['car'],
      wordOptions: ['car', 'bus', 'truck', 'bike'],
      levelType: 'word',
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      description: 'Find the word for this place',
      correctSentence: ['house'],
      wordOptions: ['house', 'school', 'park', 'store'],
      levelType: 'word',
    },
    {
      id: 5,
      imageUrl: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=400',
      description: 'Find the word for this person',
      correctSentence: ['boy'],
      wordOptions: ['boy', 'girl', 'man', 'woman'],
      levelType: 'word',
    },
    {
      id: 6,
      imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400',
      description: 'Find the word for this plant',
      correctSentence: ['tree'],
      wordOptions: ['tree', 'flower', 'grass', 'bush'],
      levelType: 'word',
    },
    {
      id: 7,
      imageUrl: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=400',
      description: 'Find the word for this weather',
      correctSentence: ['sun'],
      wordOptions: ['sun', 'rain', 'cloud', 'snow'],
      levelType: 'word',
    },
    {
      id: 8,
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      description: 'Find the word for this object',
      correctSentence: ['book'],
      wordOptions: ['book', 'pen', 'paper', 'pencil'],
      levelType: 'word',
    },
    // Level 9-14: Two Words
    {
      id: 9,
      imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
      description: 'A cat in a house',
      correctSentence: ['cat', 'house'],
      wordOptions: ['cat', 'house', 'dog', 'car', 'tree'],
      levelType: 'two-words',
    },
    {
      id: 10,
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
      description: 'A boy with an apple',
      correctSentence: ['boy', 'apple'],
      wordOptions: ['boy', 'apple', 'girl', 'banana', 'orange'],
      levelType: 'two-words',
    },
  ];

  useEffect(() => {
    setShuffledOptions(shuffleArray(levels[currentLevel].wordOptions));
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentLevel]);

  const handleWordPress = (word) => {
    setUserSentence([...userSentence, word]);
    speak(word);
  };

  const handleRemoveWord = (index) => {
    const newSentence = userSentence.filter((_, i) => i !== index);
    setUserSentence(newSentence);
  };

  const checkAnswer = () => {
    const correct = JSON.stringify(userSentence) === JSON.stringify(levels[currentLevel].correctSentence);
    setIsCorrect(correct);
    
    if (correct) {
      speak('Correct! Well done!');
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      speak('Try again!');
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setUserSentence([]);
      setIsCorrect(null);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    } else {
      speak('Congratulations! You completed all levels!');
    }
  };

  const clearSentence = () => {
    setUserSentence([]);
    setIsCorrect(null);
  };

  const speakSentence = () => {
    if (userSentence.length > 0) {
      speak(userSentence.join(' '));
    }
  };

  const currentLevelData = levels[currentLevel];

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
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
      shadowColor: currentTheme.colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    headerTitle: {
      fontSize: 24 * currentTextSize.scale,
      fontWeight: '700',
      color: currentTheme.colors.text,
      flex: 1,
    },
    levelBadge: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 16 * currentSpacing.scale,
      paddingVertical: 8 * currentSpacing.scale,
      borderRadius: 20 * currentSpacing.scale,
    },
    levelText: {
      color: '#FFFFFF',
      fontSize: 14 * currentTextSize.scale,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    imageContainer: {
      width: '100%',
      height: 280 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 24 * currentSpacing.scale,
      overflow: 'hidden',
      marginBottom: 20 * currentSpacing.scale,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: 3,
      borderColor: currentTheme.colors.primary,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    description: {
      fontSize: 20 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.text,
      textAlign: 'center',
      marginBottom: 20 * currentSpacing.scale,
      letterSpacing: 0.5,
    },
    sentenceArea: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 20 * currentSpacing.scale,
      padding: 20 * currentSpacing.scale,
      minHeight: 100 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 2,
      borderColor: isCorrect === true ? '#10B981' : isCorrect === false ? '#EF4444' : currentTheme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
    sentenceTitle: {
      fontSize: 14 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.textSecondary,
      marginBottom: 12 * currentSpacing.scale,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    sentenceWords: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10 * currentSpacing.scale,
      minHeight: 50 * currentSpacing.scale,
    },
    wordChip: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 20 * currentSpacing.scale,
      paddingVertical: 12 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
      shadowColor: currentTheme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    wordChipText: {
      color: '#FFFFFF',
      fontSize: 18 * currentTextSize.scale,
      fontWeight: '600',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 10 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentTheme.colors.primary,
      paddingVertical: 14 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
      shadowColor: currentTheme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    clearButton: {
      backgroundColor: '#EF4444',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16 * currentTextSize.scale,
      fontWeight: '600',
      marginLeft: 8 * currentSpacing.scale,
    },
    wordOptionsTitle: {
      fontSize: 16 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.text,
      marginBottom: 12 * currentSpacing.scale,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    wordOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
    },
    wordOption: {
      backgroundColor: currentTheme.colors.surface,
      paddingHorizontal: 24 * currentSpacing.scale,
      paddingVertical: 16 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
      borderWidth: 2,
      borderColor: currentTheme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    wordOptionText: {
      color: currentTheme.colors.text,
      fontSize: 18 * currentTextSize.scale,
      fontWeight: '600',
    },
    checkButton: {
      backgroundColor: currentTheme.colors.primary,
      paddingVertical: 18 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
      alignItems: 'center',
      marginBottom: 12 * currentSpacing.scale,
      shadowColor: currentTheme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    checkButtonText: {
      color: '#FFFFFF',
      fontSize: 20 * currentTextSize.scale,
      fontWeight: '700',
      letterSpacing: 1,
    },
    nextButton: {
      backgroundColor: '#10B981',
      paddingVertical: 18 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
      alignItems: 'center',
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    nextButtonText: {
      color: '#FFFFFF',
      fontSize: 20 * currentTextSize.scale,
      fontWeight: '700',
      letterSpacing: 1,
    },
    feedbackText: {
      fontSize: 18 * currentTextSize.scale,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 12 * currentSpacing.scale,
      color: isCorrect ? '#10B981' : '#EF4444',
    },
    helpButton: {
      position: 'absolute',
      bottom: 30 * currentSpacing.scale,
      right: 30 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.secondary,
      borderRadius: 32 * currentSpacing.scale,
      width: 68 * currentSpacing.scale,
      height: 68 * currentSpacing.scale,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: currentTheme.colors.secondary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 12,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        {onBack && (
          <TouchableOpacity 
            style={dynamicStyles.backButton} 
            onPress={onBack}
            activeOpacity={0.7}
          >
            <BackArrowIcon size={24 * currentTextSize.scale} color={currentTheme.colors.surface} />
          </TouchableOpacity>
        )}
        <Text style={dynamicStyles.headerTitle}>Learn to Build</Text>
        <View style={dynamicStyles.levelBadge}>
          <Text style={dynamicStyles.levelText}>Level {currentLevel + 1}/{levels.length}</Text>
        </View>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Image Display */}
        <Animated.View style={[
          dynamicStyles.imageContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <Image 
            source={{ uri: currentLevelData.imageUrl }} 
            style={dynamicStyles.image}
          />
        </Animated.View>

        {/* Description */}
        <Text style={dynamicStyles.description}>{currentLevelData.description}</Text>

        {/* Sentence Building Area */}
        <Animated.View style={[
          dynamicStyles.sentenceArea,
          { transform: [{ translateX: shakeAnim }] }
        ]}>
          <Text style={dynamicStyles.sentenceTitle}>Your Sentence</Text>
          <View style={dynamicStyles.sentenceWords}>
            {userSentence.length === 0 ? (
              <Text style={{ color: currentTheme.colors.textSecondary, fontSize: 16 * currentTextSize.scale }}>
                Tap words below to build your sentence...
              </Text>
            ) : (
              userSentence.map((word, index) => (
                <TouchableOpacity
                  key={index}
                  style={dynamicStyles.wordChip}
                  onPress={() => handleRemoveWord(index)}
                  activeOpacity={0.8}
                >
                  <Text style={dynamicStyles.wordChipText}>{word}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        {userSentence.length > 0 && (
          <View style={dynamicStyles.actionButtons}>
            <TouchableOpacity 
              style={dynamicStyles.actionButton}
              onPress={speakSentence}
              activeOpacity={0.8}
            >
              <PlayIcon size={20} color="#FFFFFF" />
              <Text style={dynamicStyles.actionButtonText}>Speak</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[dynamicStyles.actionButton, dynamicStyles.clearButton]}
              onPress={clearSentence}
              activeOpacity={0.8}
            >
              <Text style={dynamicStyles.actionButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Word Options */}
        <Text style={dynamicStyles.wordOptionsTitle}>Choose Words:</Text>
        <View style={dynamicStyles.wordOptions}>
          {shuffledOptions.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={dynamicStyles.wordOption}
              onPress={() => handleWordPress(word)}
              activeOpacity={0.7}
            >
              <Text style={dynamicStyles.wordOptionText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Check Answer Button */}
        {userSentence.length > 0 && isCorrect === null && (
          <TouchableOpacity 
            style={dynamicStyles.checkButton}
            onPress={checkAnswer}
            activeOpacity={0.8}
          >
            <Text style={dynamicStyles.checkButtonText}>Check Answer</Text>
          </TouchableOpacity>
        )}

        {/* Feedback and Next Button */}
        {isCorrect !== null && (
          <>
            <Text style={dynamicStyles.feedbackText}>
              {isCorrect ? '✓ Correct! Well done!' : '✗ Try again!'}
            </Text>
            {isCorrect && (
              <TouchableOpacity 
                style={dynamicStyles.nextButton}
                onPress={nextLevel}
                activeOpacity={0.8}
              >
                <Text style={dynamicStyles.nextButtonText}>
                  {currentLevel < levels.length - 1 ? 'Next Level →' : 'Complete! 🎉'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={dynamicStyles.helpButton} 
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <HelpIcon size={36 * currentTextSize.scale} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SentenceBuilderScreen;
