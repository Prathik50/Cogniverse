import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTTS } from '../contexts/TTSContext';
import HelpModal from '../screens/HelpModal';
import { BackArrowIcon, HelpIcon } from '../components/icons/ConditionIcons';

const LearningBasicsSuite = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  const [currentScreen, setCurrentScreen] = useState('main');
  const [showHelp, setShowHelp] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
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
  }, []);

  const handleActivityPress = (activityId, title) => {
    speak(title);
    setCurrentScreen(activityId);
  };

  const handleBackToMain = () => {
    speak('Going back to Learning Basics menu');
    setCurrentScreen('main');
  };

  const handleHelpPress = () => {
    speak(t('openingHelpForSuite'));
    setShowHelp(true);
  };

  const handleCloseHelp = () => {
    setShowHelp(false);
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
      fontSize: 24 * currentTextSize.scale,
      fontWeight: 'bold',
      color: currentTheme.colors.text,
      flex: 1,
    },
    subtitle: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 8 * currentSpacing.scale,
    },
    content: {
      flex: 1,
      padding: 20 * currentSpacing.scale,
    },
    activityCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 24 * currentSpacing.scale,
      padding: 24 * currentSpacing.scale,
      marginBottom: 20 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border || 'rgba(0,0,0,0.05)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
    },
    activityImage: {
      width: 80 * currentSpacing.scale,
      height: 80 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
      marginBottom: 12 * currentSpacing.scale,
      alignSelf: 'center',
      resizeMode: 'contain',
    },
    activityTitle: {
      fontSize: 22 * currentTextSize.scale,
      fontWeight: '700',
      color: currentTheme.colors.text,
      marginBottom: 8 * currentSpacing.scale,
    },
    activityDescription: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      lineHeight: 22 * currentTextSize.scale,
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
    helpIcon: {
      fontSize: 28 * currentTextSize.scale,
      color: currentTheme.colors.surface,
    },
    simpleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16 * currentSpacing.scale,
      borderBottomWidth: 1,
      borderBottomColor: currentTheme.colors.border,
      backgroundColor: currentTheme.colors.surface,
    },
    simpleTitle: {
      fontSize: 20 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.text,
      marginLeft: 12 * currentSpacing.scale,
    },
    cardGrid: {
      padding: 20 * currentSpacing.scale,
    },
    smallCard: {
      backgroundColor: currentTheme.colors.surface,
      borderRadius: 20 * currentSpacing.scale,
      padding: 16 * currentSpacing.scale,
      marginBottom: 12 * currentSpacing.scale,
      borderWidth: 1,
      borderColor: currentTheme.colors.border,
    },
    smallImage: {
      width: 60 * currentSpacing.scale,
      height: 60 * currentSpacing.scale,
      borderRadius: 12 * currentSpacing.scale,
      marginBottom: 8 * currentSpacing.scale,
      alignSelf: 'center',
      resizeMode: 'contain',
    },
    smallTitle: {
      fontSize: 18 * currentTextSize.scale,
      fontWeight: '600',
      color: currentTheme.colors.text,
      marginBottom: 6 * currentSpacing.scale,
      textAlign: 'center',
    },
    smallText: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
      textAlign: 'center',
    },
    numberCircle: {
      width: 80 * currentSpacing.scale,
      height: 80 * currentSpacing.scale,
      borderRadius: 40 * currentSpacing.scale,
      backgroundColor: currentTheme.colors.primary + '22',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 8 * currentSpacing.scale,
    },
    numberText: {
      fontSize: 40 * currentTextSize.scale,
      fontWeight: '800',
      color: currentTheme.colors.primary,
    },
    colorBlock: {
      width: 80 * currentSpacing.scale,
      height: 80 * currentSpacing.scale,
      borderRadius: 16 * currentSpacing.scale,
      marginBottom: 8 * currentSpacing.scale,
      alignSelf: 'center',
    },
  });

  const activities = [
    {
      id: 'numbers',
      title: 'Numbers 1 to 5',
      description: 'See and hear numbers from one to five.',
      image: { uri: 'https://img.icons8.com/color/96/1-circle.png' },
    },
    {
      id: 'colors',
      title: 'Colors',
      description: 'Learn basic colors like red, blue, and green.',
      image: { uri: 'https://img.icons8.com/color/96/rgb-circle-1.png' },
    },
    {
      id: 'alphabet',
      title: 'Alphabet',
      description: 'Match letters with simple words and pictures.',
      image: { uri: 'https://img.icons8.com/color/96/abc.png' },
    },
    {
      id: 'daily-routines',
      title: 'Daily Routines',
      description: 'Practice simple morning and night routines.',
      image: { uri: 'https://img.icons8.com/color/96/timetable.png' },
    }
  ];

  const numberCards = [
    { label: '1', word: 'one' },
    { label: '2', word: 'two' },
    { label: '3', word: 'three' },
    { label: '4', word: 'four' },
    { label: '5', word: 'five' },
  ];

  const colorCards = [
    { title: 'Red', color: '#EF4444', sentence: 'This is red.' },
    { title: 'Blue', color: '#3B82F6', sentence: 'This is blue.' },
    { title: 'Green', color: '#10B981', sentence: 'This is green.' },
    { title: 'Yellow', color: '#FBBF24', sentence: 'This is yellow.' },
  ];

  const alphabetCards = [
    {
      letter: 'A',
      title: 'A for Apple',
      image: { uri: 'https://img.icons8.com/color/96/apple.png' },
      sentence: 'A for apple.',
    },
    {
      letter: 'B',
      title: 'B for Ball',
      image: { uri: 'https://img.icons8.com/color/96/football2.png' },
      sentence: 'B for ball.',
    },
    {
      letter: 'C',
      title: 'C for Cat',
      image: { uri: 'https://img.icons8.com/color/96/cat.png' },
      sentence: 'C for cat.',
    },
    {
      letter: 'D',
      title: 'D for Dog',
      image: { uri: 'https://img.icons8.com/color/96/dog.png' },
      sentence: 'D for dog.',
    },
    {
      letter: 'E',
      title: 'E for Egg',
      image: { uri: 'https://img.icons8.com/color/96/fried-egg.png' },
      sentence: 'E for egg.',
    },
    {
      letter: 'F',
      title: 'F for Fish',
      image: { uri: 'https://img.icons8.com/color/96/fish.png' },
      sentence: 'F for fish.',
    },
    {
      letter: 'G',
      title: 'G for Grapes',
      image: { uri: 'https://img.icons8.com/color/96/grapes.png' },
      sentence: 'G for grapes.',
    },
    {
      letter: 'H',
      title: 'H for House',
      image: { uri: 'https://img.icons8.com/color/96/house.png' },
      sentence: 'H for house.',
    },
    {
      letter: 'I',
      title: 'I for Ice cream',
      image: { uri: 'https://img.icons8.com/color/96/ice-cream-cone.png' },
      sentence: 'I for ice cream.',
    },
    {
      letter: 'J',
      title: 'J for Juice',
      image: { uri: 'https://img.icons8.com/color/96/orange-juice.png' },
      sentence: 'J for juice.',
    },
    {
      letter: 'K',
      title: 'K for Kite',
      image: { uri: 'https://img.icons8.com/color/96/kite.png' },
      sentence: 'K for kite.',
    },
    {
      letter: 'L',
      title: 'L for Lion',
      image: { uri: 'https://img.icons8.com/color/96/lion.png' },
      sentence: 'L for lion.',
    },
    {
      letter: 'M',
      title: 'M for Mango',
      image: { uri: 'https://img.icons8.com/color/96/mango.png' },
      sentence: 'M for mango.',
    },
    {
      letter: 'N',
      title: 'N for Nest',
      image: { uri: 'https://img.icons8.com/color/96/nest.png' },
      sentence: 'N for nest.',
    },
    {
      letter: 'O',
      title: 'O for Orange',
      image: { uri: 'https://img.icons8.com/color/96/orange.png' },
      sentence: 'O for orange.',
    },
    {
      letter: 'P',
      title: 'P for Penguin',
      image: { uri: 'https://img.icons8.com/color/96/pinguin.png' },
      sentence: 'P for penguin.',
    },
    {
      letter: 'Q',
      title: 'Q for Queen',
      image: { uri: 'https://img.icons8.com/color/96/queen.png' },
      sentence: 'Q for queen.',
    },
    {
      letter: 'R',
      title: 'R for Rabbit',
      image: { uri: 'https://img.icons8.com/color/96/rabbit.png' },
      sentence: 'R for rabbit.',
    },
    {
      letter: 'S',
      title: 'S for Sun',
      image: { uri: 'https://img.icons8.com/color/96/sun.png' },
      sentence: 'S for sun.',
    },
    {
      letter: 'T',
      title: 'T for Train',
      image: { uri: 'https://img.icons8.com/color/96/train.png' },
      sentence: 'T for train.',
    },
    {
      letter: 'U',
      title: 'U for Umbrella',
      image: { uri: 'https://img.icons8.com/color/96/umbrella.png' },
      sentence: 'U for umbrella.',
    },
    {
      letter: 'V',
      title: 'V for Van',
      image: { uri: 'https://img.icons8.com/color/96/minivan.png' },
      sentence: 'V for van.',
    },
    {
      letter: 'W',
      title: 'W for Watch',
      image: { uri: 'https://img.icons8.com/color/96/watch.png' },
      sentence: 'W for watch.',
    },
    {
      letter: 'X',
      title: 'X for Xylophone',
      image: { uri: 'https://img.icons8.com/color/96/xylophone.png' },
      sentence: 'X for xylophone.',
    },
    {
      letter: 'Y',
      title: 'Y for Yacht',
      image: { uri: 'https://img.icons8.com/color/96/yacht.png' },
      sentence: 'Y for yacht.',
    },
    {
      letter: 'Z',
      title: 'Z for Zebra',
      image: { uri: 'https://img.icons8.com/color/96/zebra.png' },
      sentence: 'Z for zebra.',
    },
  ];

  const routineCards = [
    {
      title: 'Wake up',
      image: { uri: 'https://img.icons8.com/color/96/alarm-clock.png' },
      sentence: 'Time to wake up.',
    },
    {
      title: 'Brush teeth',
      image: { uri: 'https://img.icons8.com/color/96/toothbrush.png' },
      sentence: 'Time to brush teeth.',
    },
    {
      title: 'Learning time',
      image: { uri: 'https://img.icons8.com/color/96/classroom.png' },
      sentence: 'Time to learn.',
    },
    {
      title: 'Sleep',
      image: { uri: 'https://img.icons8.com/color/96/sleeping-in-bed.png' },
      sentence: 'Time to sleep.',
    },
  ];

  const renderNumbers = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.simpleHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToMain}
          activeOpacity={0.7}
        >
          <BackArrowIcon
            size={24 * currentTextSize.scale}
            color={currentTheme.colors.surface}
          />
        </TouchableOpacity>
        <Text style={styles.simpleTitle}>Numbers 1 to 5</Text>
      </View>
      <ScrollView style={styles.cardGrid} showsVerticalScrollIndicator={false}>
        {numberCards.map(card => (
          <TouchableOpacity
            key={card.label}
            style={styles.smallCard}
            activeOpacity={0.85}
            onPress={() => speak(card.word)}
          >
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{card.label}</Text>
            </View>
            <Text style={styles.smallText}>{card.word}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );

  const renderColors = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.simpleHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToMain}
          activeOpacity={0.7}
        >
          <BackArrowIcon
            size={24 * currentTextSize.scale}
            color={currentTheme.colors.surface}
          />
        </TouchableOpacity>
        <Text style={styles.simpleTitle}>Colors</Text>
      </View>
      <ScrollView style={styles.cardGrid} showsVerticalScrollIndicator={false}>
        {colorCards.map(card => (
          <TouchableOpacity
            key={card.title}
            style={styles.smallCard}
            activeOpacity={0.85}
            onPress={() => speak(card.title)}
          >
            <View style={[styles.colorBlock, { backgroundColor: card.color }]} />
            <Text style={styles.smallTitle}>{card.title}</Text>
            <Text style={styles.smallText}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );

  const renderAlphabet = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.simpleHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToMain}
          activeOpacity={0.7}
        >
          <BackArrowIcon
            size={24 * currentTextSize.scale}
            color={currentTheme.colors.surface}
          />
        </TouchableOpacity>
        <Text style={styles.simpleTitle}>Alphabet</Text>
      </View>
      <ScrollView style={styles.cardGrid} showsVerticalScrollIndicator={false}>
        {alphabetCards.map(card => (
          <TouchableOpacity
            key={card.letter}
            style={styles.smallCard}
            activeOpacity={0.85}
            onPress={() => speak(card.sentence)}
          >
            {card.image && (
              <Image source={card.image} style={styles.smallImage} />
            )}
            <Text style={styles.smallTitle}>{card.title}</Text>
            <Text style={styles.smallText}>{card.sentence}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );

  const renderRoutines = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.simpleHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToMain}
          activeOpacity={0.7}
        >
          <BackArrowIcon
            size={24 * currentTextSize.scale}
            color={currentTheme.colors.surface}
          />
        </TouchableOpacity>
        <Text style={styles.simpleTitle}>Daily Routines</Text>
      </View>
      <ScrollView style={styles.cardGrid} showsVerticalScrollIndicator={false}>
        {routineCards.map(card => (
          <TouchableOpacity
            key={card.title}
            style={styles.smallCard}
            activeOpacity={0.85}
            onPress={() => speak(card.sentence)}
          >
            {card.image && (
              <Image source={card.image} style={styles.smallImage} />
            )}
            <Text style={styles.smallTitle}>{card.title}</Text>
            <Text style={styles.smallText}>{card.sentence}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );

  if (currentScreen === 'numbers') {
    return renderNumbers();
  }

  if (currentScreen === 'colors') {
    return renderColors();
  }

  if (currentScreen === 'alphabet') {
    return renderAlphabet();
  }

  if (currentScreen === 'daily-routines') {
    return renderRoutines();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <BackArrowIcon
              size={24 * currentTextSize.scale}
              color={currentTheme.colors.surface}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Learning Basics</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Simple practice for numbers, colors, letters, and routines.
        </Text>

        {activities.map(activity => (
          <Animated.View
            key={activity.id}
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            }}
          >
            <TouchableOpacity
              style={styles.activityCard}
              activeOpacity={0.85}
              onPress={() => handleActivityPress(activity.id, activity.title)}
            >
              {activity.image && (
                <Image source={activity.image} style={styles.activityImage} />
              )}
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>
                {activity.description}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.helpButton}
        onPress={handleHelpPress}
        activeOpacity={0.8}
      >
        <HelpIcon size={36 * currentTextSize.scale} color="#FFFFFF" />
      </TouchableOpacity>

      <HelpModal
        visible={showHelp}
        onClose={handleCloseHelp}
        context="learning-basics"
      />
    </SafeAreaView>
  );
};

export default LearningBasicsSuite;
