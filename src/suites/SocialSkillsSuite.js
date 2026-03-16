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
import { useUser } from '../contexts/UserContext';
import HelpModal from '../screens/HelpModal';
import {
  BackArrowIcon,
  HelpIcon,
  SocialIcon,
} from '../components/icons/ConditionIcons';

const SocialSkillsSuite = ({ onBack }) => {
  const { currentTheme, currentTextSize, currentSpacing } = useTheme();
  const { t } = useLanguage();
  const { speak } = useTTS();
  const { userData } = useUser();
  const [currentScreen, setCurrentScreen] = useState('main');
  const [showHelp, setShowHelp] = useState(false);

  const displayName = userData?.name || t('friend');

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
    speak('Going back to Social Skills menu');
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
    },
    smallText: {
      fontSize: 16 * currentTextSize.scale,
      color: currentTheme.colors.textSecondary,
    },
  });

  const activities = [
    {
      id: 'greetings',
      title: 'Saying Hello',
      description: 'Practice hello, goodbye, and meeting new people.',
      image: { uri: 'https://img.icons8.com/color/96/hello.png' },
    },
    {
      id: 'feelings',
      title: 'Big Feelings',
      description: 'Learn words like happy, sad, angry, and scared.',
      image: { uri: 'https://img.icons8.com/color/96/happy.png' },
    },
    {
      id: 'asking-help',
      title: 'Asking for Help',
      description: 'Practice asking for help in a kind way.',
      image: { uri: 'https://img.icons8.com/color/96/help.png' },
    },
    {
      id: 'personal-space',
      title: 'Personal Space',
      description: 'Learn about safe and comfy distance with others.',
      image: { uri: 'https://img.icons8.com/color/96/social-distancing.png' },
    },
  ];

  const greetingCards = [
    { title: 'Hello', image: { uri: 'https://img.icons8.com/color/96/hello.png' }, sentence: `Hello, I am ${displayName}.` },
    { title: 'Goodbye', image: { uri: 'https://img.icons8.com/color/96/goodbye.png' }, sentence: 'Goodbye, see you.' },
    { title: 'Nice to meet you', image: { uri: 'https://img.icons8.com/color/96/handshake.png' }, sentence: `Nice to meet you, I am ${displayName}.` },
  ];

  const feelingCards = [
    { title: 'Happy', image: { uri: 'https://img.icons8.com/color/96/happy.png' }, sentence: 'I feel happy.' },
    { title: 'Sad', image: { uri: 'https://img.icons8.com/color/96/sad.png' }, sentence: 'I feel sad.' },
    { title: 'Angry', image: { uri: 'https://img.icons8.com/color/96/angry.png' }, sentence: 'I feel angry.' },
    { title: 'Scared', image: { uri: 'https://img.icons8.com/color/96/scared.png' }, sentence: 'I feel scared.' },
  ];

  const helpCards = [
    { title: 'Need help', image: { uri: 'https://img.icons8.com/color/96/help.png' }, sentence: `I am ${displayName}. Help please.` },
    { title: 'Don\'t understand', image: { uri: 'https://img.icons8.com/color/96/confused.png' }, sentence: `I am ${displayName}. I don't understand.` },
    { title: 'Break', image: { uri: 'https://img.icons8.com/color/96/pause.png' }, sentence: `I am ${displayName}. I need a break.` },
  ];

  const spaceCards = [
    { title: 'Too close', image: { uri: 'https://img.icons8.com/color/96/social-distancing.png' }, sentence: 'Too close. Please give me space.' },
    { title: 'Ask to hug', image: { uri: 'https://img.icons8.com/color/96/hug.png' }, sentence: 'Can I have a hug?' },
    { title: 'High five', image: { uri: 'https://img.icons8.com/color/96/high-five.png' }, sentence: 'High five instead?' },
  ];

  const renderSimpleCards = (title, cards) => (
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
        <Text style={styles.simpleTitle}>{title}</Text>
      </View>
      <ScrollView style={styles.cardGrid} showsVerticalScrollIndicator={false}>
        {cards.map(card => (
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

  if (currentScreen === 'greetings') {
    return renderSimpleCards('Saying Hello', greetingCards);
  }

  if (currentScreen === 'feelings') {
    return renderSimpleCards('Big Feelings', feelingCards);
  }

  if (currentScreen === 'asking-help') {
    return renderSimpleCards('Asking for Help', helpCards);
  }

  if (currentScreen === 'personal-space') {
    return renderSimpleCards('Personal Space', spaceCards);
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
        <Text style={styles.headerTitle}>Social Skills</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Gentle, simple practice for everyday social situations.
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
        context="social-skills"
      />
    </SafeAreaView>
  );
};

export default SocialSkillsSuite;
