import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTTS } from '../contexts/TTSContext';

const SentenceBuilderScreen = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { speak } = useTTS();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userSentence, setUserSentence] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  // Function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const levels = [
    // Levels 1-8: Single Words (Very Easy)
    {
      id: 1,
      image: '🐱',
      description: 'Find the word for this animal',
      correctSentence: ['cat'],
      wordOptions: ['cat', 'dog', 'bird', 'fish'],
      levelType: 'word',
    },
    {
      id: 2,
      image: '🍎',
      description: 'Find the word for this fruit',
      correctSentence: ['apple'],
      wordOptions: ['apple', 'banana', 'orange', 'grape'],
      levelType: 'word',
    },
    {
      id: 3,
      image: '🚗',
      description: 'Find the word for this vehicle',
      correctSentence: ['car'],
      wordOptions: ['car', 'bus', 'truck', 'bike'],
      levelType: 'word',
    },
    {
      id: 4,
      image: '🏠',
      description: 'Find the word for this place',
      correctSentence: ['house'],
      wordOptions: ['house', 'school', 'park', 'store'],
      levelType: 'word',
    },
    {
      id: 5,
      image: '👦',
      description: 'Find the word for this person',
      correctSentence: ['boy'],
      wordOptions: ['boy', 'girl', 'man', 'woman'],
      levelType: 'word',
    },
    {
      id: 6,
      image: '🌳',
      description: 'Find the word for this plant',
      correctSentence: ['tree'],
      wordOptions: ['tree', 'flower', 'grass', 'bush'],
      levelType: 'word',
    },
    {
      id: 7,
      image: '☀️',
      description: 'Find the word for this weather',
      correctSentence: ['sun'],
      wordOptions: ['sun', 'rain', 'cloud', 'snow'],
      levelType: 'word',
    },
    {
      id: 8,
      image: '📚',
      description: 'Find the word for this object',
      correctSentence: ['book'],
      wordOptions: ['book', 'pen', 'paper', 'pencil'],
      levelType: 'word',
    },

    // Levels 9-14: Two Words (Easy)
    {
      id: 9,
      image: '🐱🏠',
      description: 'A cat in a house',
      correctSentence: ['cat', 'house'],
      wordOptions: ['cat', 'house', 'dog', 'car', 'tree'],
      levelType: 'two-words',
    },
    {
      id: 10,
      image: '👦🍎',
      description: 'A boy with an apple',
      correctSentence: ['boy', 'apple'],
      wordOptions: ['boy', 'apple', 'girl', 'banana', 'orange'],
      levelType: 'two-words',
    },
    {
      id: 11,
      image: '🚗🌳',
      description: 'A car near a tree',
      correctSentence: ['car', 'tree'],
      wordOptions: ['car', 'tree', 'bus', 'flower', 'house'],
      levelType: 'two-words',
    },
    {
      id: 12,
      image: '👩📚',
      description: 'A woman with a book',
      correctSentence: ['woman', 'book'],
      wordOptions: ['woman', 'book', 'man', 'pen', 'paper'],
      levelType: 'two-words',
    },
    {
      id: 13,
      image: '🐕☀️',
      description: 'A dog in the sun',
      correctSentence: ['dog', 'sun'],
      wordOptions: ['dog', 'sun', 'cat', 'rain', 'cloud'],
      levelType: 'two-words',
    },
    {
      id: 14,
      image: '🏠🌳',
      description: 'A house with trees',
      correctSentence: ['house', 'trees'],
      wordOptions: ['house', 'trees', 'school', 'flowers', 'grass'],
      levelType: 'two-words',
    },

    // Levels 15-18: Three Words (Medium)
    {
      id: 15,
      image: '👦🍎🏠',
      description: 'A boy eating an apple at home',
      correctSentence: ['boy', 'eats', 'apple'],
      wordOptions: ['boy', 'eats', 'apple', 'girl', 'drinks', 'banana', 'house'],
      levelType: 'three-words',
    },
    {
      id: 16,
      image: '🐕🏃🌳',
      description: 'A dog running near trees',
      correctSentence: ['dog', 'runs', 'fast'],
      wordOptions: ['dog', 'runs', 'fast', 'cat', 'walks', 'slow', 'tree'],
      levelType: 'three-words',
    },
    {
      id: 17,
      image: '👩📚☀️',
      description: 'A woman reading a book outside',
      correctSentence: ['woman', 'reads', 'book'],
      wordOptions: ['woman', 'reads', 'book', 'man', 'writes', 'letter', 'sun'],
      levelType: 'three-words',
    },
    {
      id: 18,
      image: '🚗🏠🌳',
      description: 'A car parked near a house with trees',
      correctSentence: ['car', 'near', 'house'],
      wordOptions: ['car', 'near', 'house', 'bus', 'far', 'school', 'tree'],
      levelType: 'three-words',
    },

    // Levels 19-24: Full Sentences (Harder)
    {
      id: 19,
      image: '👦🍎',
      description: 'A boy eating an apple',
      correctSentence: ['The', 'boy', 'eats', 'an', 'apple'],
      wordOptions: ['The', 'boy', 'eats', 'an', 'apple', 'girl', 'drinks', 'a', 'banana'],
      levelType: 'sentence',
    },
    {
      id: 20,
      image: '🐕🏃',
      description: 'A dog running in the park',
      correctSentence: ['The', 'dog', 'runs', 'in', 'the', 'park'],
      wordOptions: ['The', 'dog', 'runs', 'in', 'the', 'park', 'cat', 'walks', 'near', 'house'],
      levelType: 'sentence',
    },
    {
      id: 21,
      image: '👩📚',
      description: 'A woman reading a book',
      correctSentence: ['The', 'woman', 'reads', 'a', 'book'],
      wordOptions: ['The', 'woman', 'reads', 'a', 'book', 'man', 'writes', 'an', 'letter'],
      levelType: 'sentence',
    },
    {
      id: 22,
      image: '🚗🏠',
      description: 'A car parked near a house',
      correctSentence: ['The', 'car', 'is', 'near', 'the', 'house'],
      wordOptions: ['The', 'car', 'is', 'near', 'the', 'house', 'bus', 'far', 'from', 'school'],
      levelType: 'sentence',
    },
    {
      id: 23,
      image: '🐱☀️',
      description: 'A cat sleeping in the sun',
      correctSentence: ['The', 'cat', 'sleeps', 'in', 'the', 'sun'],
      wordOptions: ['The', 'cat', 'sleeps', 'in', 'the', 'sun', 'dog', 'plays', 'under', 'tree'],
      levelType: 'sentence',
    },
    {
      id: 24,
      image: '👦🌳📚',
      description: 'A boy reading a book under a tree',
      correctSentence: ['The', 'boy', 'reads', 'a', 'book', 'under', 'the', 'tree'],
      wordOptions: ['The', 'boy', 'reads', 'a', 'book', 'under', 'the', 'tree', 'girl', 'writes', 'near', 'house'],
      levelType: 'sentence',
    },
  ];

  const currentLevelData = levels[currentLevel];

  // Shuffle word options when level changes
  useEffect(() => {
    if (currentLevelData && currentLevelData.wordOptions) {
      setShuffledOptions(shuffleArray(currentLevelData.wordOptions));
    }
  }, [currentLevel]);

  const handleWordPress = (word) => {
    if (userSentence.includes(word)) {
      // Remove word if already selected
      setUserSentence(userSentence.filter((w, index) => 
        userSentence.indexOf(w) !== userSentence.lastIndexOf(w) || w !== word
      ));
    } else {
      // Add word
      setUserSentence([...userSentence, word]);
    }
    setIsCorrect(null);
  };

  const checkSentence = () => {
    const userSentenceStr = userSentence.join(' ');
    const correctSentenceStr = currentLevelData.correctSentence.join(' ');
    
    if (userSentenceStr === correctSentenceStr) {
      setIsCorrect(true);
      const successMessage = 
        currentLevelData.levelType === 'word' ? 'Great! You found the right word!' :
        currentLevelData.levelType === 'two-words' ? 'Perfect! You matched the words!' :
        currentLevelData.levelType === 'three-words' ? 'Excellent! You built the phrase!' :
        'Excellent! You built the sentence correctly!';
      speak(successMessage);
      setTimeout(() => {
        nextLevel();
      }, 2000);
    } else {
      setIsCorrect(false);
      speak('Not quite right. Try again!');
    }
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setUserSentence([]);
      setIsCorrect(null);
      // Shuffle options for the new level
      const nextLevelData = levels[currentLevel + 1];
      if (nextLevelData && nextLevelData.wordOptions) {
        setShuffledOptions(shuffleArray(nextLevelData.wordOptions));
      }
    } else {
      Alert.alert('Congratulations!', 'You completed all levels!', [
        { text: 'Play Again', onPress: () => {
          setCurrentLevel(0);
          setUserSentence([]);
          setIsCorrect(null);
          // Shuffle options for level 1
          const firstLevelData = levels[0];
          if (firstLevelData && firstLevelData.wordOptions) {
            setShuffledOptions(shuffleArray(firstLevelData.wordOptions));
          }
        }},
        { text: 'OK' }
      ]);
    }
  };

  const resetLevel = () => {
    setUserSentence([]);
    setIsCorrect(null);
    // Reshuffle options for current level
    if (currentLevelData && currentLevelData.wordOptions) {
      setShuffledOptions(shuffleArray(currentLevelData.wordOptions));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentTheme.colors.surface,
      padding: 16 * currentSpacing.scale,
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
    backIcon: {
      fontSize: 24 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
    headerTitle: {
      fontSize: 20 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.text,
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    levelIndicator: {
      backgroundColor: currentTheme.colors.surface,
      padding: 12 * currentSpacing.scale,
      borderRadius: 12 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      alignItems: 'center',
    },
    levelText: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
    },
    levelTypeText: {
      fontSize: 14 * currentTextSize.scale,
      color: currentTheme.colors.primary,
      fontWeight: '600',
      marginTop: 4 * currentSpacing.scale,
    },
    imageContainer: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 16 * currentSpacing.scale,
      padding: 24 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    imageEmoji: {
      fontSize: 80 * currentTextSize.scale,
      marginBottom: 16 * currentSpacing.scale,
    },
    imageDescription: {
      fontSize: 18 * currentTextSize.scale,
      color: currentTheme.colors.text,
      textAlign: 'center',
      fontWeight: '500',
    },
    sentenceContainer: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 12 * currentSpacing.scale,
      padding: 16 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      minHeight: 60 * currentSpacing.scale,
      borderWidth: 2,
      borderColor: isCorrect === true ? '#4CAF50' : isCorrect === false ? '#F44336' : currentTheme.colors.border,
    },
    sentenceText: {
      fontSize: 20 * currentTextSize.scale,
      color: currentTheme.colors.text,
      textAlign: 'center',
      minHeight: 30 * currentTextSize.scale,
    },
    wordOptionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 20 * currentSpacing.scale,
    },
    wordButton: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 16 * currentSpacing.scale,
      paddingVertical: 12 * currentSpacing.scale,
      borderRadius: 25 * currentSpacing.scale,
      margin: 4 * currentSpacing.scale,
    },
    wordButtonSelected: {
      backgroundColor: currentTheme.colors.textSecondary,
    },
    wordButtonText: {
      color: currentTheme.colors.surface,
      fontSize: 16 * currentTextSize.scale,
      fontWeight: '500',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20 * currentSpacing.scale,
    },
    actionButton: {
      backgroundColor: currentTheme.colors.primary,
      paddingHorizontal: 24 * currentSpacing.scale,
      paddingVertical: 12 * currentSpacing.scale,
      borderRadius: 25 * currentSpacing.scale,
      flex: 0.45,
      alignItems: 'center',
    },
    resetButton: {
      backgroundColor: currentTheme.colors.textSecondary,
    },
    actionButtonText: {
      color: currentTheme.colors.surface,
      fontSize: 16 * currentTextSize.scale,
      fontWeight: '600',
    },
    feedbackContainer: {
      alignItems: 'center',
      marginTop: 20 * currentSpacing.scale,
    },
    feedbackText: {
      fontSize: 18 * currentTextSize.scale,
      fontWeight: '600',
      color: isCorrect === true ? '#4CAF50' : '#F44336',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Learn to Build</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.levelIndicator}>
          <Text style={styles.levelText}>Level {currentLevel + 1} of {levels.length}</Text>
          <Text style={styles.levelTypeText}>
            {currentLevelData.levelType === 'word' && '🎯 Single Word'}
            {currentLevelData.levelType === 'two-words' && '🔗 Two Words'}
            {currentLevelData.levelType === 'three-words' && '📝 Three Words'}
            {currentLevelData.levelType === 'sentence' && '📖 Full Sentence'}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Text style={styles.imageEmoji}>{currentLevelData.image}</Text>
          <Text style={styles.imageDescription}>{currentLevelData.description}</Text>
        </View>

        <View style={styles.sentenceContainer}>
          <Text style={styles.sentenceText}>
            {userSentence.length > 0 ? userSentence.join(' ') : 
              currentLevelData.levelType === 'word' ? 'Tap the correct word below...' :
              currentLevelData.levelType === 'two-words' ? 'Tap two words to match the picture...' :
              currentLevelData.levelType === 'three-words' ? 'Tap three words to describe the picture...' :
              'Tap words below to build your sentence...'}
          </Text>
        </View>

        <View style={styles.wordOptionsContainer}>
          {shuffledOptions.map((word, index) => {
            const isSelected = userSentence.includes(word);
            const selectedCount = userSentence.filter(w => w === word).length;
            const correctCount = currentLevelData.correctSentence.filter(w => w === word).length;
            const isCorrectlySelected = selectedCount <= correctCount;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.wordButton,
                  isSelected && styles.wordButtonSelected,
                  isSelected && !isCorrectlySelected && { backgroundColor: '#F44336' }
                ]}
                onPress={() => handleWordPress(word)}
              >
                <Text style={styles.wordButtonText}>{word}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={checkSentence}>
            <Text style={styles.actionButtonText}>
              {currentLevelData.levelType === 'word' ? 'Check Word' :
               currentLevelData.levelType === 'two-words' ? 'Check Words' :
               currentLevelData.levelType === 'three-words' ? 'Check Phrase' :
               'Check Sentence'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.resetButton]} onPress={resetLevel}>
            <Text style={styles.actionButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {isCorrect !== null && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              {isCorrect ? 
                (currentLevelData.levelType === 'word' ? '🎯 Great! You found the right word!' :
                 currentLevelData.levelType === 'two-words' ? '🔗 Perfect! You matched the words!' :
                 currentLevelData.levelType === 'three-words' ? '📝 Excellent! You built the phrase!' :
                 '📖 Excellent! You built the sentence correctly!') : 
                '❌ Not quite right. Try again!'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SentenceBuilderScreen;
